import os
from fastapi import FastAPI,HTTPException
from pydantic import BaseModel,Field
from typing import List,Optional

from langchain_huggingface import HuggingFaceEndpoint,ChatHuggingFace
from langchain_ollama import ChatOllama
from langchain_core.prompts import PromptTemplate,ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from dotenv import load_dotenv

load_dotenv()


app = FastAPI(title='LMS Questions Generator Services')
@app.get("/health")
def health_check():
    return {"status": "ok"}

if not os.getenv("HUGGINGFACEHUB_API_TOKEN"):
    raise RuntimeError("Missing HUGGINGFACEHUB_API_TOKEN environment variable")

raw_llm = HuggingFaceEndpoint(
    repo_id="Qwen/Qwen2.5-Coder-32B-Instruct",
    task="text-generation",
    max_new_tokens=2048,
    temperature=0.3, # Low temperature keep answers deterministic and structurally sound
    do_sample=True
)

llm = ChatHuggingFace(llm=raw_llm)


# llm = ChatOllama(
#     model="qwen2.5-coder:7b",
#     temperature=0.3,
#     format="json" # Forces Ollama to natively enforce JSON compliance
# )


class QuestionStructure(BaseModel):
    questionText : str = Field(description='The main text or problem statement of the question')
    type: str = Field(description="Must be strictly one of these values : 'mcq' ,'case studies' , or 'coding' ")

    options : Optional[List[str]] = Field(default=None, description="Provide an array of exactly 4 strings ONLY if type is 'mcq'. Otherwise leave it null or empty.")
    correctAnswer: Optional[str] = Field(default=None, description="The exact correct string answer from options array ONLY if type is 'mcq'. Otherwise leave it null.")
    initialCode: Optional[str] = Field(default=None, description="Provide boilerplate code structure / starting template string ONLY if type is 'coding'. Otherwise leave it null.")

class AssessmentResponse(BaseModel):
    questions : List[QuestionStructure]


parser = JsonOutputParser(pydantic_object = AssessmentResponse)

prompt_template = ChatPromptTemplate.from_messages([
    ("system", """You are an elite software engineering professor and technical interviewer. 
Your goal is to generate a comprehensive, highly rigorous, and advanced test for a candidate on the topic: {topic}.
The purpose of this evaluation is: {test_type}.

You MUST strictly generate exactly 4 questions:
- An advanced Multiple Choice Question (MCQ).
- Another advanced Multiple Choice Question (MCQ).
- A structural real-world system architecture Case Study question.
- A challenging algorithmic Coding question with a boilerplate starting code stub.

{format_instructions}

Ensure the questions are challenging, technically accurate, and completely clear of errors.
Output ONLY the raw JSON format requested without conversational fluff."""),
    ("human", "Generate the test dataset structural object layout now.")
])

class GenerateResponse(BaseModel):
    topic : str
    test_type : str


@app.post("/generate-test")
async def generate_test(payload: GenerateResponse):
    try:
        # Construct the chain normally
        chain = prompt_template | llm | parser

        # Pass 'format_instructions' directly inside the invoke dictionary!
        output = chain.invoke({
            "topic": payload.topic,
            "test_type": payload.test_type,
            "format_instructions": parser.get_format_instructions()
        })

        return output

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LangChain pipeline execution error: {str(e)}")


class AnswerSubmission(BaseModel):
    questionText: str
    type: str
    submittedAnswer: str

class GradeRequest(BaseModel):
    submissions: List[AnswerSubmission]

# --- 2. UPDATE THE ENDPOINT TO USE JSON_OUTPUT_PARSER ---
@app.post("/evaluate_submissions")
async def evaluate_submissions(payload: GradeRequest):
    try:
        # Initialize the native JSON output parser
        parser = JsonOutputParser()

        eval_prompt = ChatPromptTemplate.from_messages([
            ("system", """You are an expert technical interviewer and unyielding automated code grader.
Evaluate the user's answers thoroughly.

Grading Requirements:
- For 'coding': Check logic, execution efficiency, syntax correctness, and algorithmic complexity.
- For 'case studies': Evaluate scalability, system constraints, architectural pattern matching, and design depth.

You MUST respond with a JSON object containing an "evaluations" array. Each item in the array must contain exactly these keys:
- "questionText": (string, copy the exact question text provided)
- "score": (integer from 0 to 100 based strictly on technical accuracy)
- "feedback": (string, a constructive 2-sentence breakdown explaining wins or missed edge cases)

Ensure your entire output is valid JSON. Do not include any introductory text or closing conversational fluff."""),
            ("human", "Here are the candidate responses to grade:\n{submissions_data}\n\nFormat instructions: {format_instructions}")
        ])
        
        # Build clean lookup string data blocks for the model
        formatted_data = ""
        for index, sub in enumerate(payload.submissions):
            formatted_data += f"\n--- Task {index+1} ---\nType: {sub.type}\nQuestion: {sub.questionText}\nUser Submission:\n{sub.submittedAnswer}\n"
            
        # Bind the prompt template injection safely
        chain = eval_prompt | llm | parser
        
        report = chain.invoke({
            "submissions_data": formatted_data,
            "format_instructions": parser.get_format_instructions()
        })
        
        return report

    except Exception as e:
        print(f"❌ CRITICAL PYTHON GRADER ERROR: {str(e)}")
        raise HTTPException(status_code=500, detail=f"AI Evaluation Error: {str(e)}")



if __name__ == "__main__":
    # Render provides the port dynamically via an environment variable. Fallback to 8000 locally.
    port = int(os.environ.get("PORT", 8000))
    # host must be 0.0.0.0 so the outside network router can bind to it
    uvicorn.run("main:app", host="0.0.0.0", port=port)