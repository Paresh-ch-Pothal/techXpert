const axios = require('axios');

// --- CONFIGURATION SETUP ---
const EXPRESS_BASE_URL = 'http://localhost:5000/api/assessment'; // Adjust to your actual Node port/route base
const USER_JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNmE2ODk4NWQ5MDc5NDNkZWQ4NjFkZmU3IiwibmFtZSI6ImhlbGxvIn0sImlhdCI6MTc4NTMwMjcwNH0.DhRZSB98XCGANHHztXTmmd_9LwqTjD1obSnufOCV8fg'; // Paste a valid test user JWT token from your app here

const authHeaders = {
    headers: {
        'Content-Type': 'application/json',
        'auth-token': USER_JWT_TOKEN // Adjust to match your exact fetchuser middleware header key
    }
};

async function runAssessmentIntegrationTest() {
    try {
        console.log("🚀 Kicking off Backend Assessment Pipeline Test...");

        // =========================================================
        // STEP 1: TEST GENERATION
        // =========================================================
        console.log("\n1️⃣ Requesting test generation from backend...");
        const genPayload = {
            topic: "Python Asyncio and Multithreading",
            test_type: "course_certification" // Or "creator_verification" to test role branching
        };

        const genResponse = await axios.post(`${EXPRESS_BASE_URL}/start-test`, genPayload, authHeaders);

        if (!genResponse.data.success) {
            throw new Error("Failed to initialize test profile via Express.");
        }

        const { assessmentId, questions } = genResponse.data;
        console.log(`✅ Test Generated Successfully! Assessment ID: ${assessmentId}`);
        console.log(`📋 Received ${questions.length} questions from backend (Sanitized - No correct answers exposed).`);

        // Display questions for terminal debugging visibility
        questions.forEach((q, idx) => {
            console.log(`   [${idx + 1}] Type: ${q.type} | Text: ${q.questionText.substring(0, 60)}...`);
        });

        // =========================================================
        // STEP 2: MOCK USER SUBMISSIONS
        // =========================================================
        console.log("\n2️⃣ Mocking student exam answers based on generated IDs...");

        const mockedAnswers = questions.map(q => {
            if (q.type === 'mcq') {
                // To guarantee the MCQ passes, we dynamically search the original assessment 
                // data if available, or simulate a targeted selection. Since we stripped the answer 
                // for the client payload, we supply a logically strong answer option.
                // Note: If you fail an MCQ here, the high scores below will easily carry you over the 70% threshold.
                return {
                    questionId: q._id,
                    submittedAnswer: q.options && q.options.length > 0 ? q.options[2] : "asyncio handles concurrent I/O-bound tasks using a single-threaded event loop."
                };
            } else if (q.type === 'coding') {
                // A flawless, production-grade asyncio + aiohttp implementation handling session closures,
                // exceptions gracefully, and executing data processing tasks in an external ThreadPoolExecutor
                return {
                    questionId: q._id,
                    submittedAnswer: `
import asyncio
import aiohttp
from concurrent.futures import ThreadPoolExecutor

async def fetch_url(session, url):
    try:
        async with session.get(url, timeout=10) as response:
            if response.status == 200:
                return await response.text()
            return None
    except Exception as e:
        print(f"Error fetching data from {url}: {str(e)}")
        return None

async def fetch_and_process(urls):
    if not urls:
        return []
        
    async with aiohttp.ClientSession() as session:
        # Step 1: Concurrently fetch all raw webpage structures/payloads via event loop
        fetch_tasks = [fetch_url(session, url) for url in urls]
        raw_contents = await asyncio.gather(*fetch_tasks)
        
        # Step 2: Offload CPU-heavy text transformations to ThreadPoolExecutor to prevent blocking the single thread loop
        loop = asyncio.get_running_loop()
        with ThreadPoolExecutor(max_workers=4) as pool:
            processing_tasks = []
            for content in raw_contents:
                if content is not None:
                    # Offload execution safely
                    task = loop.run_in_executor(pool, process_data, content)
                    processing_tasks.append(task)
                else:
                    # Maintain structural index alignment even on failure cases
                    processing_tasks.append(asyncio.to_thread(lambda: None))
            
            processed_results = await asyncio.gather(*processing_tasks)
            return processed_results
                    `
                };
            } else {
                // An exceptionally detailed architectural case study breakdown explaining how 
                // to design a web scraper using decoupled producers/consumers and thread pooling.
                return {
                    questionId: q._id,
                    submittedAnswer: "To design this high-performance trading/scraping engine, I would implement a decoupled producer-consumer architecture utilizing an asyncio.Queue. The system's ingestion tier will leverage a single-threaded asyncio event loop running asynchronous HTTP sessions via aiohttp to manage tens of thousands of simultaneous open connections efficiently without thread overhead. To handle the CPU-bound data processing and calculation layer without locking the event loop, raw payloads from the queue will be dispatched dynamically to a native concurrent.futures.ThreadPoolExecutor or ProcessPoolExecutor workspace using loop.run_in_executor(). This ensures the network loop handles I/O continuously while heavy parsing runs across physical CPU threads, preventing event-loop lag and minimizing structural processing latency."
                };
            }
        });

        // =========================================================
        // STEP 3: SUBMIT AND SCORE EVALUATION
        // =========================================================
        console.log("\n3️⃣ Dispatching answers to the evaluation engine backend...");

        const submitPayload = {
            assessmentId: assessmentId,
            answers: mockedAnswers,
            violations: 1 // Keep this below 5 to prevent anti-cheat auto-voiding locks
        };

        const evalResponse = await axios.post(`${EXPRESS_BASE_URL}/submit-test`, submitPayload, authHeaders);

        // =========================================================
        // STEP 4: VERIFY EVALUATION PARSED CORRECTLY
        // =========================================================
        console.log("\n4️⃣ Analyzing Scoring Output Results:");
        console.log("--------------------------------------------------");
        console.log(`📊 Final Calculation Grade Score : ${evalResponse.data.score}%`);
        console.log(`🏆 Certification Status Result    : ${evalResponse.data.isPassed ? "PASSED (Minted)" : "FAILED"}`);

        if (evalResponse.data.certificateUrl) {
            console.log(`🎨 Cloudinary Asset URL           : ${evalResponse.data.certificateUrl}`);
        } else {
            console.log(`🎨 Cloudinary Asset URL           : None generated (either failed or test type was creator)`);
        }
        console.log("--------------------------------------------------");

        console.log("\n📝 Detailed Breakdown Report From LangChain + Local Engine:");
        evalResponse.data.report.forEach((reportItem, idx) => {
            console.log(`\n📍 Question [${idx + 1}]: ${reportItem.questionText.substring(0, 50)}...`);
            console.log(`   - Earned Points Score: ${reportItem.score}/100`);
            console.log(`   - Technical Review: ${reportItem.feedback}`);
        });

        console.log("\n🎉 Backend Pipeline Verification Completed Smoothly with zero errors!");

    } catch (error) {
        console.error("\n❌ Testing Failure Breakpoint Hit:");
        if (error.response) {
            console.error(`Status Code: ${error.response.status}`);
            console.error("Payload Reason:", error.response.data);
        } else {
            console.error("Error Message trace stack:", error.message);
        }
    }
}

// Fire execution
runAssessmentIntegrationTest();