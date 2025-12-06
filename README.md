🧊 Deep Blue
The Socratic Coding Tutor & 3D Logic Visualizer

Deep Blue is an advanced, interactive Python learning environment built around the Socratic Method. Instead of providing direct solutions, the AI mentor helps you think, guiding you through reasoning-based questions.

It includes a cutting-edge 3D AST Visualizer that transforms code into interactive 3D logic structures—helping learners see algorithms, not just write them.

🚀 Key Features
🤖 Socratic AI Tutor

Powered by Google Gemini 2.0 Flash + LangChain

Provides thought-provoking questions—not fixes

Trains algorithmic reasoning and debugging skills

🎥 3D AST Code Visualization (Pro Tier)

Converts Python code → Interactive 3D Node Graph

Built using React Three Fiber, Three.js, Drei

Visual Node Mapping:

Functions → Blue

Loops → Green

Conditionals → Orange

🎮 Gamified Missions

Alien-signal decoders

Beacon repair puzzles

Algorithm quests and logic raids

🔐 Freemium Architecture
Tier	Features
Free	Code Editor, Socratic Tutor, Easy Missions
Pro	3D Visualizer, Haptic Error Feedback, Medium/Hard Missions
⚡ Modern Tech Stack

Frontend: React + Vite, Tailwind CSS

3D Engine: Three.js, React Three Fiber

Backend: FastAPI, Uvicorn

AI Engine: Gemini + LangChain

Parsing: Python ast module

Infrastructure: Docker & Docker Compose

🛠️ Technologies Overview
Layer	Tools & Frameworks
Frontend	React, Vite, Tailwind CSS
Visualization	Three.js, React Three Fiber, Drei
Backend	FastAPI, Uvicorn
AI Engine	LangChain, Gemini 2.0 Flash
Parsing	Python ast
Networking	Axios
Infra	Docker, Docker Compose
📦 Installation & Setup
Prerequisites

Docker & Docker Compose (recommended)
OR Node.js 18+ & Python 3.9+

A valid Google Gemini API Key

⚙️ Option 1 — Quick Start with Docker (Recommended)
1. Clone the repository
git clone https://github.com/yourusername/deepblue.git
cd deepblue

2. Create environment file

backend/.env

GOOGLE_API_KEY=your_actual_api_key_here

3. Build & run
docker-compose up --build

4. Access the app

Frontend IDE: http://localhost:5173

Backend API Docs: http://localhost:8000/docs

🔧 Option 2 — Manual Setup
🖥️ Backend Setup
cd backend


Create virtual environment:

python -m venv venv
source venv/bin/activate
# Windows: venv\Scripts\activate


Install dependencies:

pip install -r requirements.txt


Run server:

uvicorn main:app --reload

🎨 Frontend Setup
cd ../frontend
npm install
npm run dev

🖥️ How to Use
✏️ Write Code

Use the left-panel editor to write Python code.

🧠 Analyze Logic

Click Analyze Logic → AI provides Socratic guidance.
No direct answers. Only leading questions.

🎥 3D AST (Pro Mode)

When Pro is active:

Backend returns 3D node coordinates

Visualizer renders real-time AST graph

Note: Free tier cannot access 3D coordinate data (backend-enforced).

🗡️ Missions

Switch to Missions for:

Coding puzzle raids

Algorithm quests

Progressive difficulty challenges

📁 Project Structure
deepblue/
├── docker-compose.yml
├── backend/
│   ├── app/
│   │   ├── data/             # Mission data (JSON)
│   │   ├── engine/
│   │   │   ├── rag_agent.py  # LangChain + Gemini
│   │   │   └── ast_parser.py # Python AST → 3D Node Graph
│   ├── main.py               # FastAPI entry point
│   ├── Dockerfile
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── components/       # UI Components
    │   ├── three-scene/      # 3D Visualizer
    │   ├── App.jsx
    │   └── main.jsx
    ├── Dockerfile
    └── tailwind.config.js
