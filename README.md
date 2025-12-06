🧊 Deep Blue — The Socratic Coding Tutor & 3D Logic Visualizer

Deep Blue is an interactive next-generation IDE designed to teach Python using the Socratic Method.
Instead of directly solving your errors, the AI mentor guides you step-by-step through questions that help you derive the solution yourself.

It also introduces a groundbreaking 3D Abstract Syntax Tree (AST) Visualizer, which transforms your code into an immersive 3D structure so you can see your logic unfold.

🚀 Features
🤖 Socratic AI Tutor

Powered by Google Gemini + LangChain.

Analyzes your code and asks thought-provoking questions.

Trains students to think algorithmically instead of relying on auto-fixes.

🧭 3D Code Visualization (Pro Feature)

Converts Python code → interactive 3D AST.

Built using React Three Fiber + Three.js.

Visualizes:

Functions → Blue nodes

Loops → Green nodes

Conditionals → Orange nodes

🎮 Gamified Missions

Alien signal decryption, beacon repairs, logic puzzles & more.

Each “Raid” is a step-by-step coding scenario.

🧪 Freemium Architecture

Free Tier

Code Editor

Socratic Tutor

Easy Missions

Pro Tier

3D Visualizer

Haptic Feedback for Errors

Medium/Hard Missions

More Mission Packs

⚡ Modern Tech Stack

Frontend: React + Vite, Tailwind CSS

3D Engine: Three.js, React Three Fiber, Drei

Backend: FastAPI, Uvicorn

AI Engine: LangChain, Google Gemini 2.0 Flash

Parsing: Python ast module

Containerization: Docker, Docker Compose

🛠️ Tech Stack
Layer	Technologies
Frontend	React (Vite), Tailwind CSS
Visualization	Three.js, React Three Fiber, Drei
Backend	FastAPI, Uvicorn
AI Engine	Gemini 2.0 Flash, LangChain
Parsing	Python ast
Network	Axios
Infra	Docker, Docker Compose
📦 Installation & Setup
Prerequisites

Docker & Docker Compose (recommended)
OR
Node.js 18+ & Python 3.9+

A valid Google Gemini API Key

🔥 Option 1: Quick Start with Docker (Recommended)
1. Clone the repository
git clone [https://github.com/yourusername/deepblue.git](https://github.com/Mannava-Daasaradhi/DeepBlue.git)
cd deepblue

2. Configure Environment Variables

Create file: backend/.env

GOOGLE_API_KEY=your_actual_api_key_here

3. Build and Run
docker-compose up --build

4. Access the App

Frontend (IDE): http://localhost:5173

Backend Docs (Swagger): http://localhost:8000/docs

🔧 Option 2: Manual Installation
🖥️ Backend Setup
cd backend


Create virtual environment:

python -m venv venv
source venv/bin/activate      # Linux/Mac
# OR
venv\Scripts\activate         # Windows


Install dependencies:

pip install -r requirements.txt


Create .env (same as Docker method).

Run server:

uvicorn main:app --reload

🎨 Frontend Setup
cd ../frontend
npm install
npm run dev

🖥️ Usage Guide
✏️ Code Editor

Write or paste Python code in the editor panel.

Click Analyze Logic.

🧠 AI Feedback (Free Mode)

AI asks guiding questions.

No direct answers—Socratic learning only.

🎥 3D AST (Pro Mode)

If Pro mode is active:

The API returns 3D coordinate data.

The visualizer renders:

Functions → Blue

Loops → Green

Conditionals → Orange

Note: Free tier physically does not receive 3D node coordinate data from the backend.

🗡️ Missions (Upcoming)

Switch to Mission Mode to solve:

Alien signal decoders

Broken relay beacons

Logic lock puzzles

🔒 Pro Mode Simulation

Toggle FREE/PRO switch in the sidebar to test flows.

📁 Project Structure
deepblue/
├── docker-compose.yml
├── backend/
│   ├── app/
│   │   ├── data/             # JSON mission data
│   │   ├── engine/           # Core Logic
│   │   │   ├── rag_agent.py  # LangChain + Gemini agent
│   │   │   └── ast_parser.py # Python → 3D AST parser
│   ├── main.py               # FastAPI entry point
│   ├── Dockerfile
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── components/       # UI Components
    │   ├── three-scene/      # CodeVisualizer.jsx + 3D logic
    │   ├── App.jsx
    │   └── main.jsx
    ├── Dockerfile
    └── tailwind.config.js
