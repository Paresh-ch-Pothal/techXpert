# 🚀 TechXpert

**TechXpert** is a full-stack, AI-powered E-Learning platform (LMS) built for technical/programming education. It combines video-based courses, an AI question generator, an automated AI grader, live webcam proctoring, and auto-generated completion certificates — all in one product.

Think of it as **YouTube for tech courses + an AI-proctored online exam hall + a certificate authority**, rolled into a single application.

---

## 📌 What is TechXpert?

TechXpert lets:
- **Learners** browse courses/playlists, watch videos, track progress, take AI-generated skill assessments under webcam proctoring, and download a certificate on completion.
- **Creators/Instructors** (verified users) upload videos and organize them into playlists/courses.

It's not just a video hosting site — the platform actively **generates unique tests with AI**, **grades subjective/coding answers with AI**, and **monitors exam integrity with computer vision**, making it a genuinely automated learning-and-assessment pipeline rather than a static course catalog.

---

## 🎯 Why I Built This

Most learning platforms stop at "watch a video and mark it done." That doesn't prove anyone actually learned anything, and instructors have no scalable way to test or grade learners at scale. TechXpert was built to close that gap:

- **Certification needs real assessment**, not just video-completion checkboxes — so every completed course ends in a real test, not a rubber stamp.
- **Writing tests by hand doesn't scale** — an instructor can't hand-craft a fresh MCQ/case-study/coding test for every learner, so an LLM pipeline generates one on demand for any topic.
- **Grading open-ended answers (code, case studies) manually doesn't scale either** — an AI grader evaluates logic, architecture, and edge cases and returns a score + feedback instantly.
- **Online tests are trivially easy to cheat on** — so the test screen uses the browser's own camera/mic via TensorFlow.js to flag when a face disappears, a second face appears, a phone is detected, or the tab loses focus/fullscreen — no server-side video upload required.
- **A certificate should mean something** — it's only issued after a passing score on an AI-graded test, and it's dynamically rendered (not a static PDF template) with the learner's real name and details.

---

## 🧠 How It Works (Architecture)

TechXpert is a **3-service architecture**:

```
┌─────────────────┐        ┌──────────────────┐        ┌──────────────────────┐
│   Client (SPA)   │ ─────▶ │  Node/Express API │ ─────▶ │ Python FastAPI Service │
│  React + Vite    │  REST  │  (Auth, Courses,   │  REST  │  (LangChain + LLM)     │
│  TensorFlow.js    │◀───── │   Certificates)     │◀───── │  Test gen + grading    │
└─────────────────┘        └────────┬─────────┘        └──────────────────────┘
                                     │
                                     ▼
                            ┌─────────────────┐
                            │   MongoDB Atlas  │
                            │ Users, Videos,    │
                            │ Playlists, Tests, │
                            │ Certificates       │
                            └─────────────────┘
                                     │
                                     ▼
                            ┌─────────────────┐
                            │    Cloudinary     │
                            │ Video/thumbnail/   │
                            │ certificate assets │
                            └─────────────────┘
```

**Flow of a typical assessment:**
1. Learner requests a test on a topic → Node API calls the **Python FastAPI + LangChain** service.
2. LangChain prompts an LLM (`Qwen2.5-Coder-32B-Instruct` via Hugging Face, with a local Ollama option) and forces **structured JSON output** (2 MCQs, 1 case study, 1 coding question) via Pydantic-validated output parsers.
3. The generated test is saved to MongoDB; the correct answers are **stripped out** before being sent to the browser (so they can't be inspected via dev tools).
4. While the test is active, `useProctoring` and `useAudioMonitor` React hooks run **face-api.js** (tiny face detector) and **coco-ssd** (object detection) locally in the browser to flag no-face, multiple-faces, phone-detected, and tab/fullscreen-exit events in real time — no exam video is ever uploaded or stored.
5. On submission, answers go back through the Python service, where the LLM grades each answer (0–100) with feedback, factoring in logic/complexity for code and architecture/scalability for case studies.
6. If the learner passes, a **certificate is dynamically rendered server-side** (Canvas-based image generation) with their name and course, and uploaded to Cloudinary.

A `USE_DUMMY_DATA` flag on the Python service lets the whole test-generation/grading pipeline be exercised with fake data during development, so the frontend can be built and tested without burning LLM API calls.

---

## 🛠️ Tech Stack

**Frontend**
- React 18 + Vite
- React Router DOM
- Tailwind CSS
- TensorFlow.js, `@tensorflow-models/coco-ssd`, `@vladmandic/face-api` — in-browser AI proctoring (face + object detection)
- Monaco Editor — in-browser code editor for coding questions
- Recharts — progress/analytics dashboards
- jsPDF + html2canvas — client-side certificate/report rendering
- Lottie React, Swiper, React Toastify, React CountUp — UI/UX polish
- Deployed on **Vercel**

**Backend (API)**
- Node.js + Express
- MongoDB + Mongoose
- JWT (`jsonwebtoken`) + `bcryptjs` — authentication
- Cloudinary + `multer-storage-cloudinary` — video/thumbnail/certificate storage
- `@napi-rs/canvas` — server-side certificate image rendering
- Deployed on **Render**

**AI Microservice**
- Python + FastAPI + Uvicorn
- LangChain (`langchain-core`, `langchain-huggingface`, `langchain-ollama`)
- Hugging Face Inference Endpoint (`Qwen2.5-Coder-32B-Instruct`) — with local **Ollama** as a swappable alternative
- Pydantic — structured, validated JSON output from the LLM

**Infra**
- MongoDB Atlas (database)
- Cloudinary (media CDN)
- Vercel (frontend) + Render (Node API + Python service)

---

## ✨ Features

- 🔐 **Auth** — JWT-based signup/signin, protected routes and middleware
- 🎬 **Video courses & playlists** — upload, organize, browse, and stream course content
- 📊 **Learner dashboard** — track liked/disliked/completed videos and completed playlists
- 🤖 **AI test generation** — on-demand MCQ, case-study, and coding questions for any topic, in strict validated JSON
- 🧑‍💻 **In-browser code editor** — Monaco-powered environment for coding questions
- 🧮 **AI-powered grading** — automated scoring (0–100) with written feedback for subjective/coding answers
- 👁️ **AI exam proctoring** — real-time face detection, multi-face detection, phone/object detection, and tab/fullscreen-exit monitoring, entirely client-side
- 🎧 **Audio monitoring** — flags suspicious audio activity during a test
- 🏆 **Dynamic certificate generation** — auto-rendered certificate image issued on passing an assessment, stored on Cloudinary
- 🔎 **Search & discovery** — search playlists/courses
- 📱 **Responsive UI** — Tailwind-based design across devices

---

## 💡 Benefits

- **For learners:** a credential that's actually earned (test + proctoring), not just a "video watched" badge — plus instant, detailed feedback instead of waiting on a human grader.
- **For instructors/creators:** zero manual test-writing or grading effort — the AI pipeline handles both, for any topic they teach.
- **For the platform:** exam integrity is enforced without expensive third-party proctoring vendors or storing sensitive exam video, since all detection runs locally in the learner's browser.
- **Engineering-wise:** a clean separation of concerns — Node handles auth/data/media, Python/LangChain handles all LLM reasoning — so the AI layer can be swapped (Hugging Face ↔ Ollama ↔ any other model) without touching the rest of the app.

---

## 🌍 Real-World Use Cases

- **Coding bootcamps / ed-tech startups** issuing verifiable completion certificates backed by an actual assessment.
- **Corporate L&D teams** running internal upskilling tracks with topic-based tests generated on demand (no content team needed to author question banks).
- **Hiring / campus placement screening** — generate a fresh, hard-to-leak technical test per candidate with proctoring built in.
- **Self-paced learners** who want an honest, testable measure of whether they actually understood a topic before moving on.
- **Instructors/YouTubers** who want to turn a video series into a certifiable mini-course without building grading infrastructure themselves.

---

## 📂 Project Structure

```
techXpert-main/
├── client/              # React + Vite frontend
│   └── src/
│       ├── component/    # Pages & UI (Courses, DashBoard, TestPage, Certificates, ...)
│       ├── hooks/         # useProctoring, useAudioMonitor (TensorFlow.js)
│       ├── config/        # media/env config
│       └── utils/          # API helpers, cloudinary upload, etc.
├── server/               # Node/Express API
│   ├── controller/        # Assessment orchestration (calls Python AI service)
│   ├── models/             # User, Video, Playlist, Assessment, Certificate
│   ├── routes/              # /api/user, /api/video, /api/assessment, /api/certificate
│   └── utils/                # Certificate rendering (canvas)
├── python-server/         # FastAPI + LangChain AI microservice
│   └── main.py              # /generate-test and /evaluate_submissions endpoints
└── scripts/                # Cloudinary asset migration script
```

---

## ⚙️ Getting Started (Local Development)

**1. Backend (Node API)**
```bash
cd server
cp .env.example .env   # fill in MONGODB_URI, JWT_SECRET, CLOUD_NAME, API_KEY, API_SECRET
npm install
npm start               # or: npx nodemon index.js
```

**2. AI Microservice (Python)**
```bash
cd python-server
pip install -r requirements.txt
# set HUGGINGFACEHUB_API_TOKEN in your environment, or set USE_DUMMY_DATA=true to skip the LLM
python main.py           # runs on http://localhost:8000
```

**3. Frontend**
```bash
cd client
cp .env.example .env    # VITE_API_URL=http://localhost:5000
npm install
npm run dev              # Vite dev server on http://localhost:3000
```

> Full production deployment steps (MongoDB Atlas, Cloudinary, Render, Vercel) are documented in [`DEPLOYMENT.md`](./DEPLOYMENT.md).

---

## 📄 License

Add your preferred license here (e.g., MIT).
