from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import json
import os
import io
import contextlib
import traceback
import re

# --- INTERNAL IMPORTS ---
from app.engine.rag_agent import ai_tutor
from app.engine.ast_parser import parse_code_to_3d

# --- DATABASE IMPORTS ---
from app.database import engine, get_db
from app import models

# Initialize Database Tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- REQUEST MODELS ---
class CodeRequest(BaseModel):
    code: str
    user_input: str = ""
    session_id: str = "default_user"
    is_premium: bool = False
    mission_id: int = None
    user_id: int = None # Added for saving progress

@app.get("/")
def read_root():
    return {"status": "Deep Blue API is running 🔵"}

# --- DATABASE ENDPOINTS ---

@app.post("/register")
def register_user(username: str, db: Session = Depends(get_db)):
    """
    Registers a new user or logs in an existing one.
    """
    existing = db.query(models.User).filter(models.User.username == username).first()
    if existing:
        return {"message": "User found", "user_id": existing.id, "is_premium": existing.is_premium}
    
    new_user = models.User(username=username)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "Welcome Commander", "user_id": new_user.id, "is_premium": False}

@app.post("/save-progress")
def save_progress(user_id: int, mission_id: int, code: str, db: Session = Depends(get_db)):
    """
    Saves completed mission code to the database.
    """
    existing = db.query(models.UserProgress).filter_by(user_id=user_id, mission_id=mission_id).first()
    
    if existing:
        existing.code_solution = code
        existing.is_completed = True
    else:
        progress = models.UserProgress(
            user_id=user_id, 
            mission_id=mission_id, 
            is_completed=True, 
            code_solution=code
        )
        db.add(progress)
    
    db.commit()
    return {"status": "Mission Accomplished & Saved 💾"}

# --- EXECUTION & TEST ENGINE ---

@app.post("/execute")
async def execute_code(request: CodeRequest):
    # Security Filter
    forbidden = ["import os", "import subprocess", "open(", "remove(", "rmdir"]
    if any(bad in request.code for bad in forbidden):
        return {"output": "⚠️ Security Alert: File system access is restricted."}

    output_buffer = io.StringIO()
    try:
        # 1. Run Code
        with contextlib.redirect_stdout(output_buffer):
            safe_globals = {"__builtins__": __builtins__}
            exec(request.code, safe_globals)
            
            # 2. Run Test Cases (If mission_id is present)
            test_results = []
            if request.mission_id:
                try:
                    # Load missions safely
                    with open(os.path.join("app", "data", "missions.json"), "r") as f:
                        data = json.load(f)
                    
                    # Flatten missions (Handles Dictionary or List structure)
                    all_missions = []
                    if isinstance(data, dict):
                        for cat in data: 
                            # Extract missions from category list
                            category_missions = data[cat] if isinstance(data[cat], list) else []
                            for m in category_missions:
                                # Ensure m is a dict before extending
                                if isinstance(m, dict):
                                    all_missions.append(m)
                    elif isinstance(data, list):
                        all_missions = data

                    mission = next((m for m in all_missions if m.get("id") == request.mission_id), None)

                    if mission and "test_cases" in mission:
                        # Extract function name from code using Regex
                        match = re.search(r"def\s+(\w+)\(", request.code)
                        if match:
                            func_name = match.group(1)
                            user_func = safe_globals.get(func_name)
                            
                            if user_func:
                                for i, case in enumerate(mission["test_cases"]):
                                    inputs = case["input"]
                                    expected = case["expected"]
                                    try:
                                        # Run user function with test inputs
                                        result = user_func(*inputs)
                                        passed = result == expected
                                        test_results.append({
                                            "id": i + 1,
                                            "input": str(inputs),
                                            "expected": str(expected),
                                            "actual": str(result),
                                            "passed": passed
                                        })
                                    except Exception as e:
                                        test_results.append({"id": i+1, "passed": False, "actual": str(e)})
                        else:
                             test_results.append({"id": 0, "passed": False, "actual": "No function definition found."})

                except Exception as e:
                    print(f"Test Runner Error: {e}")

        return {
            "output": output_buffer.getvalue(),
            "test_results": test_results
        }
    except Exception:
        return {"output": traceback.format_exc()}
    finally:
        output_buffer.close()

# --- VISUALIZATION & AI ENGINE ---

@app.post("/analyze")
async def analyze_code(request: CodeRequest):
    try:
        # Premium Gate for 3D
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

@app.get("/missions")
def get_missions(is_premium: bool = False):
    file_path = os.path.join("app", "data", "missions.json")
    try:
        with open(file_path, "r") as f:
            data = json.load(f)
        
        # Flatten Dictionary Structure for Frontend
        all_missions = []
        if isinstance(data, dict):
            for category in data:
                items = data[category] if isinstance(data[category], list) else []
                for m in items:
                    if isinstance(m, dict):
                        # FIX: Do not overwrite difficulty. Add category tag instead.
                        m['category_tag'] = category 
                        all_missions.append(m)
        elif isinstance(data, list):
            all_missions = data

        # Filter Logic
        if is_premium:
            return all_missions 
        else:
            return [m for m in all_missions if m.get('difficulty') == 'Easy']
            
    except Exception as e:
        print(f"Error loading missions: {e}")
        return []