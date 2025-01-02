from src.models.user_model import User
from sqlalchemy.orm import Session
from jose import jwt

SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"

def authenticate_user(username: str, password: str):
    # Mock user lookup
    if username == "test" and password == "password":
        return jwt.encode({"sub": username}, SECRET_KEY, algorithm=ALGORITHM)
    return None
