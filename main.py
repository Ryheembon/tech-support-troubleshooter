from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
import logging
from datetime import datetime
import json
from typing import List

from database import get_db, create_tables
from models import User, TroubleshootingSession
from auth import get_password_hash, verify_password, create_access_token, verify_token
from diagnostic_engine import diagnostic_engine
from schemas import UserCreate, UserLogin, Token, IssueCreate, IssueResponse, DiagnosticResponse

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('tech_whisperer.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Tech Whisperer API",
    description="A troubleshooting assistant for common tech issues with AI-powered diagnostics",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    token = credentials.credentials
    username = verify_token(token)
    if username is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.on_event("startup")
async def startup_event():
    create_tables()
    logger.info("Database tables created")

app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
async def root():
    return FileResponse("static/index.html")

@app.get("/api")
async def api_info():
    logger.info("API info endpoint accessed")
    return {
        "message": "Welcome to Tech Whisperer API!", 
        "status": "running",
        "features": [
            "AI-powered tech issue diagnosis",
            "User authentication with JWT",
            "Session history tracking",
            "OpenAI integration for intelligent responses"
        ]
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.post("/register", response_model=Token)
async def register(user: UserCreate, db: Session = Depends(get_db)):
    logger.info(f"Registration attempt for username: {user.username}")
    
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    db_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    access_token = create_access_token(data={"sub": user.username})
    
    logger.info(f"User {user.username} registered successfully")
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/login", response_model=Token)
async def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    logger.info(f"Login attempt for username: {user_credentials.username}")
    
    user = db.query(User).filter(User.username == user_credentials.username).first()
    if not user or not verify_password(user_credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": user.username})
    
    logger.info(f"User {user.username} logged in successfully")
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/diagnose", response_model=DiagnosticResponse)
async def diagnose_issue(
    issue: IssueCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    logger.info(f"Diagnosis request from user {current_user.username}")
    
    diagnosis_result = diagnostic_engine.analyze_issue(issue.description)
    
    session = TroubleshootingSession(
        user_id=current_user.id,
        issue_description=issue.description,
        diagnosis=diagnosis_result["diagnosis"],
        follow_up_questions=json.dumps(diagnosis_result["follow_up_questions"]),
        solutions=json.dumps(diagnosis_result["solutions"])
    )
    
    db.add(session)
    db.commit()
    db.refresh(session)
    
    logger.info(f"Diagnosis completed for session {session.id}")
    
    return DiagnosticResponse(
        diagnosis=diagnosis_result["diagnosis"],
        confidence=diagnosis_result["confidence"],
        follow_up_questions=diagnosis_result["follow_up_questions"],
        solutions=diagnosis_result["solutions"],
        issue_type=diagnosis_result["issue_type"]
    )

@app.get("/sessions", response_model=List[IssueResponse])
async def get_user_sessions(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    logger.info(f"Fetching sessions for user {current_user.username}")
    
    sessions = db.query(TroubleshootingSession).filter(
        TroubleshootingSession.user_id == current_user.id
    ).order_by(TroubleshootingSession.created_at.desc()).all()
    
    return sessions

@app.get("/sessions/{session_id}", response_model=IssueResponse)
async def get_session(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    session = db.query(TroubleshootingSession).filter(
        TroubleshootingSession.id == session_id,
        TroubleshootingSession.user_id == current_user.id
    ).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return session

@app.get("/stats")
async def get_usage_stats(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    total_sessions = db.query(TroubleshootingSession).filter(
        TroubleshootingSession.user_id == current_user.id
    ).count()
    
    recent_sessions = db.query(TroubleshootingSession).filter(
        TroubleshootingSession.user_id == current_user.id
    ).order_by(TroubleshootingSession.created_at.desc()).limit(5).all()
    
    return {
        "total_sessions": total_sessions,
        "recent_sessions": len(recent_sessions),
        "user_since": current_user.created_at.isoformat(),
        "ai_powered": True
    }

@app.get("/test-openai")
async def test_openai():
    try:
        test_issue = "My computer is running very slowly"
        result = diagnostic_engine.analyze_issue(test_issue)
        return {
            "status": "success",
            "test_issue": test_issue,
            "diagnosis": result["diagnosis"],
            "confidence": result["confidence"]
        }
    except Exception as e:
        logger.error(f"OpenAI test failed: {e}")
        return {
            "status": "error",
            "message": str(e)
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
