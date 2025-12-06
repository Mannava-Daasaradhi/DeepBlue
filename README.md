🧊 Deep Blue
The Socratic Coding Tutor & 3D Logic Visualizer

Deep Blue is a next-generation interactive Python learning environment built on the Socratic Method.
Rather than giving direct solutions, the AI mentor asks guiding questions that train you to think and debug logically.

The system also includes a futuristic 3D AST (Abstract Syntax Tree) Visualizer, allowing learners to see their code as a dynamic 3D structure.

<br>
🚀 Features
🤖 Socratic AI Tutor

Powered by Google Gemini 2.0 Flash + LangChain

Guides by questioning and reasoning

No auto-fix → students learn problem-solving mindset

🎥 3D Code Visualization (Pro Feature)

Python code → Interactive 3D Node Graph

Built using React Three Fiber, Three.js, Drei

Visual Node Colors:

Functions: Blue

Loops: Green

Conditionals: Orange

🎮 Gamified Missions

Alien signal decryption puzzles

Broken beacon repair missions

Step-by-step guided coding quests

🔐 Freemium Architecture
Tier	Access
Free	Code Editor, Socratic Tutor, Easy Missions
Pro	3D Visualizer, Haptic Feedback, Medium/Hard Missions
⚡ Modern Stack

Frontend: React + Vite, Tailwind CSS

Visualization: Three.js, React Three Fiber, Drei

Backend: FastAPI, Uvicorn

AI Engine: Gemini 2.0 Flash + LangChain

Parsing: Python ast module

Infrastructure: Docker, Docker Compose

<br>
🛠️ Tech Stack Overview
Layer	Technologies
Frontend	React, Vite, Tailwind CSS
3D Rendering	Three.js, React Three Fiber
Backend	FastAPI, Python
AI	Gemini 2.0 Flash, LangChain
Parsing	Python AST
Networking	Axios
Deployment	Docker, Docker Compose
<br>
📦 Installation & Setup
Prerequisites

Docker & Docker Compose (recommended)
OR Node.js 18+ & Python 3.9+

A valid Google Gemini API Key

⚙️ Option 1 — Quick Start with Docker (Recommended)
1. Clone repository
git clone [https://github.com/yourusername/deepblue.git](https://github.com/Mannava-Daasaradhi/DeepBlue.git)
cd deepblue

2. Create environment file

Path: backend/.env

3. Build & run
docker-compose up --build

4. Access

Frontend: http://localhost:5173

Backend Docs: http://localhost:8000/docs

<br>
🔧 Option 2 — Manual Setup
🖥️ Backend Setup
cd backend


Create virtual environment:

python -m venv venv
source venv/bin/activate
# Windows: venv\Scripts\activate


Install dependencies:

pip install -r requirements.txt


Run backend:

uvicorn main:app --reload

🎨 Frontend Setup
cd ../frontend
npm install
npm run dev

<br>
🖥️ How to Use Deep Blue
✏️ 1. Write Python Code

Use the left editor panel to write your program.

🧠 2. Analyze Logic

Click Analyze Logic → receive Socratic feedback.
No direct answers—your reasoning is trained.

🎥 3. Visualize in 3D (Pro Mode)

If Pro mode is enabled:

Backend sends 3D AST node coordinates

Visualizer renders code in real time

Free Tier: Backend does not send 3D data (hard-enforced security).

🎮 4. Missions

Open Missions Tab to solve logic puzzles and coding raids.

<br>
📁 Project Structure
deepblue/
├── docker-compose.yml
├── backend/
│   ├── app/
│   │   ├── data/             # Missions JSON
│   │   ├── engine/
│   │   │   ├── rag_agent.py  # LangChain + Gemini Agent
│   │   │   └── ast_parser.py # AST → 3D Node Parser
│   ├── main.py               # FastAPI entry point
│   ├── Dockerfile
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── components/       # UI Elements
    │   ├── three-scene/      # 3D Visualizer
    │   ├── App.jsx
    │   └── main.jsx
    ├── Dockerfile
    └── tailwind.config.js
