# import os
# import random
# from fastapi import FastAPI,HTTPException
# from pydantic import BaseModel,Field
# from typing import List,Optional

# from langchain_huggingface import HuggingFaceEndpoint,ChatHuggingFace
# from langchain_ollama import ChatOllama
# from langchain_core.prompts import PromptTemplate,ChatPromptTemplate
# from langchain_core.output_parsers import JsonOutputParser
# from dotenv import load_dotenv
# import uvicorn

# load_dotenv()




# app = FastAPI(title='LMS Questions Generator Services')
# @app.get("/health")
# def health_check():
#     return {"status": "ok"}

# # --- DUMMY MODE TOGGLE ---
# # Set USE_DUMMY_DATA=true in your .env / environment while testing the frontend
# # or running integration tests, so you don't burn HuggingFace API calls.
# # Set it to false (or unset it) in production.
# USE_DUMMY_DATA = os.getenv("USE_DUMMY_DATA", "false").lower() in ("1", "true", "yes")

# if not USE_DUMMY_DATA:
#     if not os.getenv("GOOGLE_API_KEY"):
#         raise RuntimeError("Missing GOOGLE_API_KEY environment variable")

#     from langchain_google_genai import ChatGoogleGenerativeAI

#     llm = ChatGoogleGenerativeAI(
#         model="gemini-2.5-flash",
#         temperature=0.3,  # Low temperature keeps answers deterministic and structurally sound
#         max_output_tokens=2048,
#     )
# else:
#     llm = None  # not needed in dummy mode


# # llm = ChatOllama(
# #     model="qwen2.5-coder:7b",
# #     temperature=0.3,
# #     format="json" # Forces Ollama to natively enforce JSON compliance
# # )


# class QuestionStructure(BaseModel):
#     questionText : str = Field(description='The main text or problem statement of the question')
#     type: str = Field(description="Must be strictly one of these values : 'mcq' ,'case studies' , or 'coding' ")

#     options : Optional[List[str]] = Field(default=None, description="Provide an array of exactly 4 strings ONLY if type is 'mcq'. Otherwise leave it null or empty.")
#     correctAnswer: Optional[str] = Field(default=None, description="The exact correct string answer from options array ONLY if type is 'mcq'. Otherwise leave it null.")
#     initialCode: Optional[str] = Field(default=None, description="Provide boilerplate code structure / starting template string ONLY if type is 'coding'. Otherwise leave it null.")

# class AssessmentResponse(BaseModel):
#     questions : List[QuestionStructure]


# parser = JsonOutputParser(pydantic_object = AssessmentResponse)

# prompt_template = ChatPromptTemplate.from_messages([
#     ("system", """You are an elite software engineering professor and technical interviewer. 
# Your goal is to generate a comprehensive, highly rigorous, and advanced test for a candidate on the topic: {topic}.
# The purpose of this evaluation is: {test_type}.

# You MUST strictly generate exactly 4 questions:
# - An advanced Multiple Choice Question (MCQ).
# - Another advanced Multiple Choice Question (MCQ).
# - A structural real-world system architecture Case Study question.
# - A challenging algorithmic Coding question with a boilerplate starting code stub.

# {format_instructions}

# Ensure the questions are challenging, technically accurate, and completely clear of errors.
# Output ONLY the raw JSON format requested without conversational fluff."""),
#     ("human", "Generate the test dataset structural object layout now.")
# ])

# class GenerateResponse(BaseModel):
#     topic : str
#     test_type : str


# def build_dummy_test(topic: str, test_type: str) -> dict:
#     """Static/fake AssessmentResponse-shaped payload, used when USE_DUMMY_DATA is on."""
#     return {
#         "questions": [
#             {
#                 "questionText": f"[DUMMY] Which of the following best describes a key concept in {topic}?",
#                 "type": "mcq",
#                 "options": [
#                     f"{topic} Option A - correct concept",
#                     f"{topic} Option B - distractor",
#                     f"{topic} Option C - distractor",
#                     f"{topic} Option D - distractor",
#                 ],
#                 "correctAnswer": f"{topic} Option A - correct concept",
#                 "initialCode": None,
#             },
#             {
#                 "questionText": f"[DUMMY] Which statement about {topic} is technically accurate ({test_type})?",
#                 "type": "mcq",
#                 "options": [
#                     "Dummy option 1",
#                     "Dummy option 2 - correct",
#                     "Dummy option 3",
#                     "Dummy option 4",
#                 ],
#                 "correctAnswer": "Dummy option 2 - correct",
#                 "initialCode": None,
#             },
#             {
#                 "questionText": f"[DUMMY] Design a scalable system architecture that leverages {topic}. "
#                                  f"Discuss trade-offs relevant to: {test_type}.",
#                 "type": "case studies",
#                 "options": None,
#                 "correctAnswer": None,
#                 "initialCode": None,
#             },
#             {
#                 "questionText": f"[DUMMY] Implement an algorithm demonstrating {topic}.",
#                 "type": "coding",
#                 "options": None,
#                 "correctAnswer": None,
#                 "initialCode": "def solution():\n    # TODO: implement\n    pass\n",
#             },
#         ]
#     }


# @app.post("/generate-test")
# async def generate_test(payload: GenerateResponse):
#     try:
#         if USE_DUMMY_DATA:
#             return build_dummy_test(payload.topic, payload.test_type)

#         # Construct the chain normally
#         chain = prompt_template | llm | parser

#         # Pass 'format_instructions' directly inside the invoke dictionary!
#         output = chain.invoke({
#             "topic": payload.topic,
#             "test_type": payload.test_type,
#             "format_instructions": parser.get_format_instructions()
#         })

#         return output

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"LangChain pipeline execution error: {str(e)}")


# class AnswerSubmission(BaseModel):
#     questionText: str
#     type: str
#     submittedAnswer: str

# class GradeRequest(BaseModel):
#     submissions: List[AnswerSubmission]


# def build_dummy_evaluation(payload: GradeRequest) -> dict:
#     """
#     Fake grading report used when USE_DUMMY_DATA is on.
#     Scores are always > 30 so the candidate always passes during testing.
#     """
#     evaluations = []
#     for sub in payload.submissions:
#         evaluations.append({
#             "questionText": sub.questionText,
#             "score": random.randint(31, 100),  # always > 30 -> always "pass" in dummy/testing mode
#             "feedback": "[DUMMY] Answer reviewed in test mode. This is a placeholder evaluation "
#                         "generated without calling the LLM to save API usage.",
#         })
#     return {"evaluations": evaluations}


# # --- 2. UPDATE THE ENDPOINT TO USE JSON_OUTPUT_PARSER ---
# @app.post("/evaluate_submissions")
# async def evaluate_submissions(payload: GradeRequest):
#     try:
#         if USE_DUMMY_DATA:
#             return build_dummy_evaluation(payload)

#         # Initialize the native JSON output parser
#         parser = JsonOutputParser()

#         eval_prompt = ChatPromptTemplate.from_messages([
#             ("system", """You are an expert technical interviewer and unyielding automated code grader.
# Evaluate the user's answers thoroughly.

# Grading Requirements:
# - For 'coding': Check logic, execution efficiency, syntax correctness, and algorithmic complexity.
# - For 'case studies': Evaluate scalability, system constraints, architectural pattern matching, and design depth.

# You MUST respond with a JSON object containing an "evaluations" array. Each item in the array must contain exactly these keys:
# - "questionText": (string, copy the exact question text provided)
# - "score": (integer from 0 to 100 based strictly on technical accuracy)
# - "feedback": (string, a constructive 2-sentence breakdown explaining wins or missed edge cases)

# Ensure your entire output is valid JSON. Do not include any introductory text or closing conversational fluff."""),
#             ("human", "Here are the candidate responses to grade:\n{submissions_data}\n\nFormat instructions: {format_instructions}")
#         ])
        
#         # Build clean lookup string data blocks for the model
#         formatted_data = ""
#         for index, sub in enumerate(payload.submissions):
#             formatted_data += f"\n--- Task {index+1} ---\nType: {sub.type}\nQuestion: {sub.questionText}\nUser Submission:\n{sub.submittedAnswer}\n"
            
#         # Bind the prompt template injection safely
#         chain = eval_prompt | llm | parser
        
#         report = chain.invoke({
#             "submissions_data": formatted_data,
#             "format_instructions": parser.get_format_instructions()
#         })
        
#         return report

#     except Exception as e:
#         print(f"❌ CRITICAL PYTHON GRADER ERROR: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"AI Evaluation Error: {str(e)}")



# if __name__ == "__main__":
#     # Render provides the port dynamically via an environment variable. Fallback to 8000 locally.
#     port = int(os.environ.get("PORT", 8000))
#     # host must be 0.0.0.0 so the outside network router can bind to it
#     uvicorn.run("main:app", host="0.0.0.0", port=port)




import os
import copy
import random
import itertools
from typing import List, Optional

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from dotenv import load_dotenv
import uvicorn

load_dotenv()

app = FastAPI(title="LMS Questions Generator Services")


@app.get("/health")
def health_check():
    return {"status": "ok"}


# --- DUMMY MODE TOGGLE ---
# Set USE_DUMMY_DATA=true in your .env / Render environment while testing the
# frontend or running integration tests, so you don't burn Gemini API calls.
# Set it to false (or unset it) when you want real AI-generated questions.
USE_DUMMY_DATA = os.getenv("USE_DUMMY_DATA", "false").lower() in ("1", "true", "yes")

if not USE_DUMMY_DATA:
    if not os.getenv("GOOGLE_API_KEY"):
        raise RuntimeError("Missing GOOGLE_API_KEY environment variable")

    from langchain_google_genai import ChatGoogleGenerativeAI

    llm = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        temperature=0.3,  # Low temperature keeps answers deterministic and structurally sound
        max_output_tokens=8192,  # Gemini 2.5 "thinking" tokens count toward this, so keep it generous
    )
else:
    llm = None  # not needed in dummy mode


# ---------------------------------------------------------------------------
# Schemas
# ---------------------------------------------------------------------------
class QuestionStructure(BaseModel):
    questionText: str = Field(description="The main text or problem statement of the question")
    type: str = Field(description="Must be strictly one of these values: 'mcq', 'case studies', or 'coding'")

    options: Optional[List[str]] = Field(
        default=None,
        description="Provide an array of exactly 4 strings ONLY if type is 'mcq'. Otherwise leave it null or empty.",
    )
    correctAnswer: Optional[str] = Field(
        default=None,
        description="The exact correct string answer from options array ONLY if type is 'mcq'. Otherwise leave it null.",
    )
    initialCode: Optional[str] = Field(
        default=None,
        description="Provide boilerplate code structure / starting template string ONLY if type is 'coding'. Otherwise leave it null.",
    )


class AssessmentResponse(BaseModel):
    questions: List[QuestionStructure]


class GenerateResponse(BaseModel):
    topic: str
    test_type: str


class AnswerSubmission(BaseModel):
    questionText: str
    type: str
    submittedAnswer: str


class GradeRequest(BaseModel):
    submissions: List[AnswerSubmission]


# ---------------------------------------------------------------------------
# Test generation prompt
# ---------------------------------------------------------------------------
generate_parser = JsonOutputParser(pydantic_object=AssessmentResponse)

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
    ("human", "Generate the test dataset structural object layout now."),
])


# ---------------------------------------------------------------------------
# Dummy data (used only when USE_DUMMY_DATA is on)
# 1st call -> Operating Systems, 2nd call -> Cloud Computing, then repeats.
# ---------------------------------------------------------------------------
DUMMY_TESTS = [
    # ---------- 1st call: Operating Systems ----------
    {
        "questions": [
            {
                "questionText": "Which CPU scheduling algorithm can cause starvation of long-running processes?",
                "type": "mcq",
                "options": [
                    "First Come First Served (FCFS)",
                    "Shortest Job First (SJF)",
                    "Round Robin",
                    "Multilevel Feedback Queue with aging",
                ],
                "correctAnswer": "Shortest Job First (SJF)",
                "initialCode": None,
            },
            {
                "questionText": "Which of the following is NOT one of the four necessary (Coffman) conditions for deadlock?",
                "type": "mcq",
                "options": [
                    "Mutual exclusion",
                    "Hold and wait",
                    "Preemption of resources",
                    "Circular wait",
                ],
                "correctAnswer": "Preemption of resources",
                "initialCode": None,
            },
            {
                "questionText": "Design the memory management strategy for a multi-tenant server running hundreds of "
                                "processes. Discuss paging vs segmentation, page replacement policy, thrashing "
                                "prevention, and how you would isolate tenants.",
                "type": "case studies",
                "options": None,
                "correctAnswer": None,
                "initialCode": None,
            },
            {
                "questionText": "Implement an LRU (Least Recently Used) page replacement simulator. Given a list of page "
                                "references and a frame count, return the number of page faults.",
                "type": "coding",
                "options": None,
                "correctAnswer": None,
                "initialCode": "def count_page_faults(pages: list[int], frames: int) -> int:\n"
                               "    # TODO: implement LRU replacement\n"
                               "    pass\n",
            },
        ]
    },
    # ---------- 2nd call: Cloud Computing ----------
    {
        "questions": [
            {
                "questionText": "In which cloud service model does the customer manage the OS, runtime and applications, "
                                "while the provider manages only the physical hardware and virtualization?",
                "type": "mcq",
                "options": ["IaaS", "PaaS", "SaaS", "FaaS"],
                "correctAnswer": "IaaS",
                "initialCode": None,
            },
            {
                "questionText": "A load balancer routes requests to different backend services based on the URL path. "
                                "At which OSI layer does it operate?",
                "type": "mcq",
                "options": [
                    "Layer 3 (Network)",
                    "Layer 4 (Transport)",
                    "Layer 7 (Application)",
                    "Layer 2 (Data Link)",
                ],
                "correctAnswer": "Layer 7 (Application)",
                "initialCode": None,
            },
            {
                "questionText": "Design a highly available, multi-region e-commerce backend on a public cloud. Cover "
                                "data replication, failover strategy, autoscaling, cost trade-offs and how you would "
                                "meet a 99.99% uptime target.",
                "type": "case studies",
                "options": None,
                "correctAnswer": None,
                "initialCode": None,
            },
            {
                "questionText": "Implement a token bucket rate limiter class that allows a burst up to `capacity` "
                                "and refills at `refill_rate` tokens per second.",
                "type": "coding",
                "options": None,
                "correctAnswer": None,
                "initialCode": "import time\n\n"
                               "class TokenBucket:\n"
                               "    def __init__(self, capacity: int, refill_rate: float):\n"
                               "        # TODO: initialise state\n"
                               "        pass\n\n"
                               "    def allow_request(self) -> bool:\n"
                               "        # TODO: return True if a token is available\n"
                               "        pass\n",
            },
        ]
    },
]

# Cycles OS -> Cloud -> OS -> Cloud ... on every call
_dummy_cycle = itertools.cycle(DUMMY_TESTS)


def build_dummy_test(topic: str, test_type: str) -> dict:
    """Returns the next hardcoded question set in rotation (ignores topic)."""
    return copy.deepcopy(next(_dummy_cycle))


def build_dummy_evaluation(payload: GradeRequest) -> dict:
    """
    Fake grading report used when USE_DUMMY_DATA is on.
    Scores are always > 30 so the candidate always passes during testing.
    """
    evaluations = []
    for sub in payload.submissions:
        evaluations.append({
            "questionText": sub.questionText,
            "score": random.randint(31, 100),  # always > 30 -> always "pass" in dummy/testing mode
            "feedback": "[DUMMY] Answer reviewed in test mode. This is a placeholder evaluation "
                        "generated without calling the LLM to save API usage.",
        })
    return {"evaluations": evaluations}


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------
@app.post("/generate-test")
async def generate_test(payload: GenerateResponse):
    try:
        if USE_DUMMY_DATA:
            return build_dummy_test(payload.topic, payload.test_type)

        chain = prompt_template | llm | generate_parser

        output = chain.invoke({
            "topic": payload.topic,
            "test_type": payload.test_type,
            "format_instructions": generate_parser.get_format_instructions(),
        })

        return output

    except Exception as e:
        print(f"❌ CRITICAL PYTHON GENERATOR ERROR: {str(e)}")
        raise HTTPException(status_code=500, detail=f"LangChain pipeline execution error: {str(e)}")


@app.post("/evaluate_submissions")
async def evaluate_submissions(payload: GradeRequest):
    try:
        if USE_DUMMY_DATA:
            return build_dummy_evaluation(payload)

        eval_parser = JsonOutputParser()

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
            ("human", "Here are the candidate responses to grade:\n{submissions_data}\n\nFormat instructions: {format_instructions}"),
        ])

        # Build clean lookup string data blocks for the model
        formatted_data = ""
        for index, sub in enumerate(payload.submissions):
            formatted_data += (
                f"\n--- Task {index + 1} ---\n"
                f"Type: {sub.type}\n"
                f"Question: {sub.questionText}\n"
                f"User Submission:\n{sub.submittedAnswer}\n"
            )

        chain = eval_prompt | llm | eval_parser

        report = chain.invoke({
            "submissions_data": formatted_data,
            "format_instructions": eval_parser.get_format_instructions(),
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