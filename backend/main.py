from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import json
import os
import sys
import io
import contextlib
import traceback

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
    is_premium: bool = False 

@app.get("/")
def read_root():
    return {"status": "Deep Blue API is running 🔵"}

# --- NEW: SAFE CODE EXECUTION ---
@app.post("/execute")
async def execute_code(request: CodeRequest):
    """
    Runs the user's Python code in a controlled environment 
    and returns the stdout/stderr.
    """
    # Security: Basic blocklist to prevent system damage
    # In production, use a Docker container per user!
    forbidden_keywords = ["import os", "import subprocess", "open(", "delete", "remove"]
    for kw in forbidden_keywords:
        if kw in request.code:
            return {"output": f"⚠️ Security Alert: usage of '{kw}' is restricted in this demo."}

    # Capture Standard Output (print statements)
    output_buffer = io.StringIO()
    
    try:
        # Redirect stdout to our buffer
        with contextlib.redirect_stdout(output_buffer):
            # Create a restricted global environment
            exec_globals = {"__builtins__": __builtins__} 
            # Run the code
            exec(request.code, exec_globals)
            
        return {"output": output_buffer.getvalue()}
        
    except Exception:
        # Capture runtime errors (syntax error, division by zero, etc)
        return {"output": traceback.format_exc()}
    finally:
        output_buffer.close()


@app.post("/analyze")
async def analyze_code(request: CodeRequest):
    # 1. Generate 3D Data
    try:
        if request.is_premium:
            visual_data = parse_code_to_3d(request.code)
        else:
            visual_data = None 
    except Exception as e:
        visual_data = {"error": str(e), "nodes": [], "links": []}
    
    # 2. AI Feedback
    ai_feedback = ""
    if request.user_input or request.code:
        try:
            ai_feedback = ai_tutor.chat(request.user_input, user_code=request.code, session_id=request.session_id)
        except Exception as e:
            ai_feedback = f"AI Error: {str(e)}"

    # 3. Haptics
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
    file_path = os.path.join("app", "data", "missions.json")
    with open(file_path, "r") as f:
        all_missions = json.load(f)
    
    if is_premium:
        return all_missions 
    else:
        return [m for m in all_missions if m['difficulty'] == 'Easy']