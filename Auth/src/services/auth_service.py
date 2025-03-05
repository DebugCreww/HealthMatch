# Correzione 1: src/services/auth_service.py
# Questo file corregge il problema dell'utilizzo del campo "password" invece di "hashed_password"
# e corregge la funzione register_user

from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError
from src.models.user_model import User, SessionLocal
from passlib.context import CryptContext
import os

# Configurazione per hashing delle password
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Usa variabili d'ambiente per chiavi sensibili
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your_secret_key_development_only")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", "30"))

def hash_password(password: str) -> str:
    """Crea un hash per la password."""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica se la password è corretta."""
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    """Genera un token JWT."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str):
    """Verifica la validità di un token JWT."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            return {"status": "invalid", "message": "Invalid token"}
        return {"status": "valid", "payload": payload}
    except JWTError:
        return {"status": "invalid", "message": "Invalid token"}

def refresh_token(token: str):
    """Rigenera un nuovo token JWT."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        role: str = payload.get("role")
        if email is None or role is None:
            return {"error": "Invalid token"}
        new_token = create_access_token({"sub": email, "role": role})
        return new_token
    except JWTError:
        return {"error": "Invalid token"}

def authenticate_user(email: str, password: str):
    """Autentica un utente tramite email e password."""
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        if not user:
            return {"error": "Credenziali non valide", "code": "invalid_credentials"}
        
        if not verify_password(password, user.hashed_password):
            return {"error": "Credenziali non valide", "code": "invalid_credentials"}
        
        # Genera il token JWT
        token = create_access_token({"sub": user.email, "role": user.role})
        return {"access_token": token, "token_type": "bearer", "user": {"id": user.id, "name": user.name, "role": user.role}}
    finally:
        db.close()

def register_user(name: str, email: str, password: str, role: str):
    """Registra un nuovo utente."""
    db = SessionLocal()
    try:
        existing_user = db.query(User).filter(User.email == email).first()
        if existing_user:
            return {"error": "Email already registered"}
        
        # Hash della password
        hashed_password = hash_password(password)
        
        # Crea il nuovo utente con il campo corretto hashed_password
        new_user = User(name=name, email=email, hashed_password=hashed_password, role=role)
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return {"status": "success", "user_id": new_user.id}
    except Exception as e:
        db.rollback()
        return {"error": f"Database error: {str(e)}"}
    finally:
        db.close()