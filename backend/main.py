from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

# Import YOUR engines
from app.engine.rag_agent import ai_tutor
from app.engine.ast_parser import parse_code_to_3d

app = FastAPI()

# Allow Sangeeth's Frontend to talk to us
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CodeRequest(BaseModel):
    code: str
    user_input: str = ""
    session_id: str = "default_user"

@app.get("/")
def read_root():
    return {"status": "Deep Blue API is running 🔵"}

@app.post("/analyze")
async def analyze_code(request: CodeRequest):
    """
    The Core Pipeline:
    1. Parse Code -> 3D AST
    2. AI Tutor -> Socratic Feedback
    3. Haptics -> Vibration Logic
    """
    # 1. Generate 3D Data for Sangeeth
    try:
        visual_data = parse_code_to_3d(request.code)
    except Exception as e:
        visual_data = {"error": str(e), "nodes": [], "links": []}
    
    # 2. Get AI Feedback from Your Engine
    ai_feedback = ""
    if request.user_input or request.code:
        try:
            ai_feedback = ai_tutor.chat(
                request.user_input, 
                user_code=request.code,
                session_id=request.session_id
            )
        except Exception as e:
            ai_feedback = f"AI Error: {str(e)}"

    # 3. Haptic Feedback Logic
    should_vibrate = False
    if "error" in visual_data:
        should_vibrate = True

    return {
        "visual_data": visual_data,
        "ai_feedback": ai_feedback,
        "haptic_feedback": should_vibrate
    }
import json

@app.get("/missions")
def get_missions():
    # In real life, fetch from DB. For now, load JSON.
    with open("app/data/missions.json", "r") as f:
        return json.load(f)