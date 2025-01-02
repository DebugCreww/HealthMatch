from fastapi import APIRouter, HTTPException
from src.services.auth_service import authenticate_user

router = APIRouter()

@router.post("/login")
def login(username: str, password: str):
    token = authenticate_user(username, password)
    if not token:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"access_token": token}
