from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import json
import os

# Import engines
from app.engine.rag_agent import ai_tutor
from app.engine.ast_parser import parse_code_to_3d

app = FastAPI()

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
    is_premium: bool = False  # <--- NEW: Track if user paid

@app.get("/")
def read_root():
    return {"status": "Deep Blue API is running 🔵"}

@app.post("/analyze")
async def analyze_code(request: CodeRequest):
    # 1. Generate 3D Data
    try:
        # FREEMIUM LOGIC: Free users get limited/no 3D data? 
        # For this MVP, we send data but frontend hides it, OR we block it here.
        # Let's be strict: Free users get NO 3D data from server.
        if request.is_premium:
            visual_data = parse_code_to_3d(request.code)
        else:
            visual_data = None # Locked for free users
    except Exception as e:
        visual_data = {"error": str(e), "nodes": [], "links": []}
    
    # 2. AI Feedback (Available to everyone)
    ai_feedback = ""
    if request.user_input or request.code:
        try:
            ai_feedback = ai_tutor.chat(request.user_input, user_code=request.code, session_id=request.session_id)
        except Exception as e:
            ai_feedback = f"AI Error: {str(e)}"

    # 3. Haptics (Premium Feature)
    should_vibrate = False
    if request.is_premium and visual_data and "error" in visual_data:
        should_vibrate = True

    return {
        "visual_data": visual_data,
        "ai_feedback": ai_feedback,
        "haptic_feedback": should_vibrate,
        "premium_locked": not request.is_premium
    }

@app.get("/missions")
def get_missions(is_premium: bool = False):
    # Load missions
    file_path = os.path.join("app", "data", "missions.json")
    with open(file_path, "r") as f:
        all_missions = json.load(f)
    
    # FREEMIUM LOGIC: Filter missions
    if is_premium:
        return all_missions # All access
    else:
        # Free users only see 'Easy' missions
        return [m for m in all_missions if m['difficulty'] == 'Easy']