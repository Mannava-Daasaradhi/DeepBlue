# 🧊 Deep Blue

**The Socratic Coding Tutor & 3D Logic Visualizer**

Deep Blue is a next-generation interactive Python learning environment built on the Socratic Method. Rather than giving direct solutions, the AI mentor asks guiding questions that train you to think and debug logically. The platform also includes a futuristic **3D AST (Abstract Syntax Tree) Visualizer**, a gamified mission system, secure code execution, and a full freemium tier architecture.

---

## 📚 Table of Contents

1. [Features](#-features)
2. [Tech Stack](#-tech-stack)
3. [Project Structure](#-project-structure)
4. [Architecture Overview](#-architecture-overview)
5. [AI Tutor — Socratic Engine](#-ai-tutor--socratic-engine)
6. [3D Code Visualizer](#-3d-code-visualizer)
7. [Secure Code Execution](#-secure-code-execution)
8. [Gamified Missions](#-gamified-missions)
9. [Freemium Model](#-freemium-model)
10. [Database](#-database)
11. [API Reference](#-api-reference)
12. [Frontend Components](#-frontend-components)
13. [Installation & Setup](#-installation--setup)
14. [How to Use](#-how-to-use)
15. [Environment Variables](#-environment-variables)

---

## 🚀 Features

### 🤖 Socratic AI Tutor
- Powered by **Google Gemini 2.5 Flash** + **LangChain**
- Guides learners with targeted questions instead of giving direct answers
- Three adaptive **tutor roles** per mission:
  - **Architect** — focuses on logic design and problem structure
  - **Translator** — focuses on Python syntax and implementation
  - **Debugger** — focuses on tracing errors and edge cases
- Per-session **conversation memory** so context is maintained across messages
- Automatically triggered with Socratic feedback when test cases fail

### 🎥 3D Code Visualization *(Pro Feature)*
- Parses Python code into an **Abstract Syntax Tree (AST)** and renders it as an interactive 3D node graph
- Built with **React Three Fiber**, **Three.js**, and **Drei**
- **Physics-based force-directed layout** — nodes repel and attract dynamically
- Color-coded node types:
  | Node Type | Color | Size |
  |-----------|-------|------|
  | Functions | 🔵 Blue | Large |
  | Loops | 🟢 Green | Medium |
  | Conditionals | 🟠 Orange | Medium |
  | Statements | ⚪ Gray | Small |
  | Operations | 🩷 Pink | Small |
- Animated node rotations, starfield background, and full **OrbitControls** camera
- Locked for Free tier users (enforced on the backend — no data is sent)

### 🎮 Gamified Missions
- **46 hand-crafted coding missions** spanning categories like:
  - Linear Algebra & Matrix Operations
  - Physics Simulations
  - Cryptography Puzzles
  - Graph Algorithms
  - String Manipulation
- Every mission includes starter code, test cases, and role-specific AI guidance
- Test-driven feedback loop: write code → run tests → get Socratic analysis on failures
- Progress saved to database when all test cases pass

### 🔐 Freemium Architecture
| Tier | Access |
|------|--------|
| **Free** | Code Editor, Socratic Tutor, Easy Missions |
| **Pro** | 3D Visualizer, Haptic Feedback, All Missions (Medium & Hard) |

### 🔒 Secure Code Execution Sandbox
- Runs user-submitted Python in an **isolated subprocess** with a 2-second timeout
- Restricted builtins: only safe functions like `print`, `range`, `len`, `int`, etc.
- Blocks dangerous keywords: `import os`, `import subprocess`, `open()`, and more

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, Vite 5, Tailwind CSS 3.4, Framer Motion |
| **3D Rendering** | Three.js 0.160, React Three Fiber 8, Drei 9, React Force Graph 3D |
| **Backend** | FastAPI, Python 3.9, Uvicorn, SQLAlchemy 2.0 |
| **AI Engine** | Google Gemini 2.5 Flash, LangChain Core, LangChain Google GenAI |
| **Code Parsing** | Python built-in `ast` module |
| **Database** | SQLite (via SQLAlchemy ORM) |
| **Authentication** | Passlib + Bcrypt (password hashing) |
| **HTTP Client** | Axios |
| **Infrastructure** | Docker, Docker Compose |

---

## 📁 Project Structure

```
DeepBlue/
├── docker-compose.yml                  # Multi-container orchestration
├── README.md
│
├── backend/
│   ├── main.py                         # FastAPI app entry point & all route definitions
│   ├── requirements.txt                # Python dependencies
│   ├── Dockerfile
│   ├── check_models.py                 # Utility to verify available Gemini API models
│   │
│   └── app/
│       ├── models.py                   # SQLAlchemy ORM models (User, UserProgress)
│       ├── database.py                 # SQLite database engine & session setup
│       │
│       ├── data/
│       │   └── missions.json           # 46 gamified coding missions
│       │
│       └── engine/
│           ├── rag_agent.py            # Socratic AI tutor (LangChain + Gemini)
│           ├── ast_parser.py           # Python AST → 3D node graph converter
│           └── executor.py             # Secure sandboxed code executor
│
└── frontend/
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── Dockerfile
    │
    └── src/
        ├── main.jsx                    # React app entry point
        ├── App.jsx                     # Root component & screen routing
        ├── index.css
        │
        ├── components/
        │   ├── Dashboard.jsx           # Main IDE interface (editor, terminal, AI panel)
        │   ├── MissionSelect.jsx       # Mission browser with search & filters
        │   └── LoginModal.jsx          # Login / registration modal
        │
        └── three-scene/
            └── CodeVisualizer.jsx      # 3D AST renderer (React Three Fiber)
```

---

## 🏗️ Architecture Overview

```
User Browser
    │
    ▼
React Frontend (port 5173)
    │  Axios HTTP
    ▼
FastAPI Backend (port 8000)
    ├── /execute   → executor.py   → Sandboxed subprocess
    ├── /analyze   → rag_agent.py  → Google Gemini 2.5 Flash (LangChain)
    │              → ast_parser.py → Python AST → 3D graph JSON
    ├── /missions  → missions.json
    └── /register  → SQLite DB (User, UserProgress)
```

---

## 🤖 AI Tutor — Socratic Engine

**File:** `backend/app/engine/rag_agent.py`

The Socratic AI uses **Google Gemini 2.5 Flash** via LangChain's `ChatGoogleGenerativeAI`. Each session maintains conversation history using `InMemoryChatMessageHistory`, so the tutor remembers prior exchanges.

**How it works:**
1. The mission's `roles` field provides three distinct guidance scripts (Architect, Translator, Debugger).
2. The active role is injected into the system prompt along with the mission objective.
3. The LLM is instructed to **never give code solutions directly** — only ask questions that lead the student to the answer.
4. Temperature is set to `0.5` for a balance between consistency and creativity.

**Example system prompt behavior:**
- ✅ "What does your loop do on the last iteration?"
- ✅ "Have you considered what happens when the list is empty?"
- ❌ "Here is the corrected code: `for i in range(n): ...`"

---

## 🎥 3D Code Visualizer

**File:** `frontend/src/three-scene/CodeVisualizer.jsx`

When a user clicks **Analyze**, the backend parses the submitted Python code using the built-in `ast` module (`backend/app/engine/ast_parser.py`) and returns a JSON graph:

```json
{
  "nodes": [
    { "id": "func_0", "label": "solve", "type": "function" },
    { "id": "loop_1", "label": "for loop", "type": "loop" }
  ],
  "links": [
    { "source": "func_0", "target": "loop_1" }
  ]
}
```

The frontend renders this using **React Three Fiber** with a custom `useForceLayout` physics hook that simulates node repulsion and attraction for a natural, readable layout. Users can rotate, zoom, and pan the graph with full **OrbitControls**.

**AST Node Types Parsed:**
- `FunctionDef` → Function nodes
- `For` / `While` → Loop nodes
- `If` → Conditional nodes
- `Assign` → Statement nodes
- `Call` → Operation nodes

---

## 🔒 Secure Code Execution

**File:** `backend/app/engine/executor.py`

User code is never `eval()`-ed in the main process. Instead:

1. Code is checked for **forbidden keywords** (`import os`, `subprocess`, `open`, `exec`, `eval`, `__import__`).
2. A new Python **subprocess** is spawned with a restricted globals dictionary (only safe builtins).
3. A **2-second timeout** kills the process to prevent infinite loops.
4. The function defined in the user's code is extracted and called against each test case's input.
5. Results (pass/fail with actual vs. expected values) are returned to the frontend.

**Allowed builtins in sandbox:**
`print`, `range`, `len`, `int`, `float`, `str`, `list`, `dict`, `set`, `bool`, `abs`, `round`, `min`, `max`, `sum`

---

## 🎮 Gamified Missions

**File:** `backend/app/data/missions.json`

46 missions are included. Each mission object has this structure:

```json
{
  "id": 101,
  "title": "Dot Product Decoder",
  "difficulty": "Easy",
  "description": "Compute the dot product of two vectors...",
  "roles": {
    "architect": "Think about what a dot product means geometrically...",
    "translator": "Python's zip() function pairs elements from two lists...",
    "debugger": "Check your loop bounds — are you iterating over the right range?"
  },
  "starter_code": "def solve(a, b):\n    pass",
  "solution_keywords": ["sum", "zip"],
  "test_cases": [
    { "input": [[1, 2, 3], [4, 5, 6]], "expected": 32 }
  ]
}
```

**Mission Categories include:**
- 🔢 Linear Algebra (dot product, matrix multiply, transpose)
- ⚛️ Physics Simulations (projectile motion, wave interference)
- 🔐 Cryptography (Caesar cipher, XOR encryption)
- 🕸️ Graph Algorithms (BFS, path finding)
- 🔤 String Manipulation

---

## 💳 Freemium Model

The freemium tier is enforced **server-side**:

- `GET /missions` — returns only `difficulty: "Easy"` missions for free users
- `POST /analyze` — returns `premium_locked: true` and skips 3D data generation for free users
- The frontend shows an upgrade overlay on the 3D panel for free users

**Demo shortcut:** Register with username `pro` to automatically receive premium access.

---

## 🗄️ Database

**File:** `backend/app/models.py` | **Engine:** `backend/app/database.py`

SQLite database (`deepblue.db`) managed by **SQLAlchemy 2.0**.

```
┌─────────────────────────┐     ┌──────────────────────────────┐
│          users           │     │        user_progress          │
├─────────────────────────┤     ├──────────────────────────────┤
│ id          INTEGER (PK) │◄────│ user_id     INTEGER (FK)      │
│ username    TEXT (UNIQUE)│     │ id          INTEGER (PK)      │
│ hashed_pw   TEXT         │     │ mission_id  INTEGER           │
│ is_premium  BOOLEAN      │     │ is_completed BOOLEAN         │
└─────────────────────────┘     │ code_solution TEXT            │
                                 └──────────────────────────────┘
```

---

## 📡 API Reference

Base URL: `http://localhost:8000`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check |
| `GET` | `/missions?is_premium={bool}` | List missions (filtered by tier) |
| `POST` | `/register` | Register or login a user |
| `POST` | `/execute` | Run code against test cases |
| `POST` | `/analyze` | Get AI feedback + 3D AST graph |
| `POST` | `/upgrade-premium?user_id={id}` | Upgrade user to Pro |
| `POST` | `/save-progress?user_id={id}&mission_id={id}&code={code}` | Save mission completion |

### `POST /register`
```json
// Request
{ "username": "alice", "password": "secret" }

// Response
{ "user_id": 1, "is_premium": false }
```

### `POST /execute`
```json
// Request
{
  "code": "def solve(a, b):\n    return sum(x*y for x,y in zip(a,b))",
  "mission_id": 101,
  "user_id": 1,
  "session_id": "abc123",
  "is_premium": false
}

// Response
{
  "output": "All tests passed!",
  "test_results": [
    { "input": [[1,2,3],[4,5,6]], "expected": 32, "actual": 32, "passed": true }
  ]
}
```

### `POST /analyze`
```json
// Request
{ "code": "def solve(n):\n    pass", "user_input": "I don't know where to start", "session_id": "abc123", "is_premium": true }

// Response
{
  "ai_feedback": "What's the smallest subproblem you can solve here?",
  "visual_data": { "nodes": [...], "links": [...] },
  "haptic_feedback": false,
  "premium_locked": false
}
```

Full interactive API docs available at: **http://localhost:8000/docs**

---

## 🖥️ Frontend Components

### `App.jsx`
Root component managing global state and screen routing:
- **Screens:** `login` → `mission-select` → `dashboard`
- Persists session (`user_id`, `is_premium`) in `localStorage`

### `LoginModal.jsx`
- Username/password form with error handling
- Registers new users or logs in existing ones
- Futuristic dark theme with gradient typography

### `MissionSelect.jsx`
- Responsive grid of all 46 missions
- Filter by difficulty: **All / Easy / Medium / Hard**
- Live search across mission titles and descriptions
- Color-coded difficulty badges; locked missions shown for free tier

### `Dashboard.jsx`
The main IDE interface, split into panels:
- **Left panel (editor + terminal):**
  - Monaco-style code editor with auto-indentation and tab support
  - Terminal output showing execution results
  - Test results tab (pass/fail per test case with input/expected/actual)
  - **Run** and **Analyze Logic** buttons
- **Right panel (visualizer + AI):**
  - 3D code visualizer (Pro) or upgrade prompt (Free)
  - Socratic AI feedback panel with chat-style display
  - Haptic feedback triggered on errors (supported devices)

### `CodeVisualizer.jsx`
- Custom `useForceLayout` physics hook driving node positions
- `<Canvas>` scene with `<Stars>`, `<OrbitControls>`, node meshes, and `<Line>` edges
- Graceful error and empty-state messages

---

## 📦 Installation & Setup

### Prerequisites
- **Docker & Docker Compose** *(recommended)*  
  OR **Node.js 18+** and **Python 3.9+**
- A valid **Google Gemini API Key** ([get one here](https://aistudio.google.com/app/apikey))

---

### ⚙️ Option 1 — Docker (Recommended)

```bash
# 1. Clone the repository
git clone https://github.com/Mannava-Daasaradhi/DeepBlue.git
cd DeepBlue

# 2. Create the backend environment file
echo "GOOGLE_API_KEY=your_api_key_here" > backend/.env

# 3. Build and start all services
docker-compose up --build
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| API Docs (Swagger) | http://localhost:8000/docs |

---

### 🔧 Option 2 — Manual Setup

**Backend:**
```bash
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
echo "GOOGLE_API_KEY=your_api_key_here" > .env

# Start the server
uvicorn main:app --reload
```

**Frontend** *(new terminal):*
```bash
cd frontend
npm install
npm run dev
```

---

## 🖥️ How to Use

1. **Register / Log in** — Create an account on the login screen. Use username `pro` to auto-receive premium access for demo purposes.

2. **Pick a Mission** — Browse the mission library. Filter by difficulty or search by keyword. Free users see Easy missions only.

3. **Write Python Code** — Use the editor on the left to implement the `solve()` function for your chosen mission.

4. **Run Tests** — Click **Run** to execute your code against all test cases. Results appear in the Test Results tab with pass/fail indicators.

5. **Analyze Logic** — Click **Analyze Logic** to:
   - Receive a **Socratic question** from the AI tutor tailored to your current code
   - See your code rendered as an **interactive 3D graph** (Pro only)

6. **Iterate** — Use the AI's questions to guide your thinking, revise your code, and re-run until all tests pass.

7. **Upgrade** — Click the upgrade button in the 3D panel to unlock Pro features (3D Visualizer, Medium/Hard missions, haptic feedback).

---

## 🔑 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GOOGLE_API_KEY` | ✅ Yes | Google Gemini API key for the AI tutor |

Create this file at `backend/.env`:
```
GOOGLE_API_KEY=your_gemini_api_key_here
```

