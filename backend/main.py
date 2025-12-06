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

@app.post("/execute")
async def execute_code(request: CodeRequest):
    forbidden = ["import os", "import subprocess", "open(", "remove(", "rmdir"]
    if any(bad in request.code for bad in forbidden):
        return {"output": "⚠️ Security Alert: File system access is restricted."}

    output_buffer = io.StringIO()
    try:
        with contextlib.redirect_stdout(output_buffer):
            safe_globals = {"__builtins__": __builtins__}
            exec(request.code, safe_globals)
        return {"output": output_buffer.getvalue()}
    except Exception:
        return {"output": traceback.format_exc()}
    finally:
        output_buffer.close()

@app.post("/analyze")
async def analyze_code(request: CodeRequest):
    try:
        if request.is_premium:
            visual_data = parse_code_to_3d(request.code)
        else:
            visual_data = None 
    except Exception as e:
        visual_data = {"error": str(e), "nodes": [], "links": []}
    
    ai_feedback = ""
    if request.user_input or request.code:
        try:
            ai_feedback = ai_tutor.chat(request.user_input, user_code=request.code, session_id=request.session_id)
        except Exception as e:
            ai_feedback = f"AI Error: {str(e)}"

    should_vibrate = False
    if request.is_premium and visual_data and "error" in visual_data:
        should_vibrate = True

    return {
        "visual_data": visual_data,
        "ai_feedback": ai_feedback,
        "haptic_feedback": should_vibrate,
        "premium_locked": not request.is_premium
    }

# --- UPDATED MISSION LOGIC ---
@app.get("/missions")
def get_missions(is_premium: bool = False):
    file_path = os.path.join("app", "data", "missions.json")
    
    # 1. Load the structured JSON
    with open(file_path, "r") as f:
        data = json.load(f)
    
    # 2. Flatten: Convert {"Easy": [], "Medium": []} -> [{}, {}, {}]
    all_missions = []
    if isinstance(data, dict):
        for category in data:
            all_missions.extend(data[category])
    elif isinstance(data, list):
        all_missions = data

    # 3. Filter based on Premium status
    if is_premium:
        return all_missions 
    else:
        # Free users only see 'Easy' missions
        return [m for m in all_missions if m.get('difficulty') == 'Easy']