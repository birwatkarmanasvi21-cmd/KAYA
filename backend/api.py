import os
import json
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy.orm import Session
from sentence_transformers import SentenceTransformer

from database import SessionLocal, User, engine
from utils import load_remedies, predict_condition, detect_severity, get_followup_suggestions, detect_red_flags

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Load model and remedies
print("Loading model and remedies...")
try:
    # Fallback to the base model immediately since the fine-tuned model 
    # was trained with L2 minimization (which zeros out embeddings)
    model = SentenceTransformer("all-MiniLM-L6-v2")
except Exception:
    model = SentenceTransformer("all-MiniLM-L6-v2")
remedies = load_remedies()
print("Model and remedies loaded.")

class UserCreate(BaseModel):
    name: str
    age: Optional[int] = None
    sex: Optional[str] = None
    allergens: List[str] = []

class ChatRequest(BaseModel):
    user_id: int
    message: str

@app.post("/api/users")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = User(
        name=user.name,
        age=user.age,
        sex=user.sex,
        allergens=user.allergens
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {"user_id": db_user.id}

@app.post("/api/chat")
def chat(request: ChatRequest, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.id == request.user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    query = request.message
    
    if detect_red_flags(query):
        return {
            "content": "🚨 EMERGENCY: Your symptoms indicate a potentially life-threatening condition. Please call emergency services (e.g., 911) or visit the nearest hospital immediately.",
            "severity": "critical",
            "confidence": 1.0,
            "remedies": []
        }

    severity = detect_severity(query)
    result = predict_condition(model, query, remedies)
    
    matched_item = result["matched_item"]
    all_remedies = matched_item.get("remedies", [])
    
    # Filter out remedies containing allergens
    filtered_remedies = []
    for remedy in all_remedies:
        contains_allergen = False
        remedy_lower = remedy.lower()
        for allergen in db_user.allergens:
            if allergen.lower() in remedy_lower:
                contains_allergen = True
                break
        if not contains_allergen:
            filtered_remedies.append(remedy)
            
    # Format the text response
    confidence_pct = round(result["confidence"] * 100, 2)
    remedies_text = "\n".join([f"- {r}" for r in filtered_remedies])
    
    if not filtered_remedies:
        remedies_text = "No safe remedies found due to your allergies. Please consult a doctor."

    message_content = (
        f"It looks like you may have **{matched_item['condition']}**.\n\n"
        f"Here are some gentle home remedies you can try:\n"
        f"{remedies_text}\n\n"
        f"**Confidence:** {confidence_pct}%\n"
        f"**Severity level detected:** {severity}\n\n"
        f"This is not medical advice. If symptoms worsen or persist, please consult a doctor."
    )

    remedy_objects = [{"name": "Remedy", "description": r, "allergens": [], "confidence": result["confidence"]} for r in filtered_remedies]

    return {
        "content": message_content,
        "severity": severity,
        "confidence": result["confidence"],
        "remedies": remedy_objects
    }
