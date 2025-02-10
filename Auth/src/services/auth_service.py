from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError
from src.models.user_model import User, SessionLocal
from passlib.context import CryptContext

# Configurazione per hashing delle password
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Chiave segreta e algoritmo per la generazione del token JWT
SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30  # Durata del token in minuti

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
            raise JWTError
        return payload
    except JWTError:
        return {"status": "invalid", "message": "Invalid token"}

def refresh_token(token: str):
    """Rigenera un nuovo token JWT."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        role: str = payload.get("role")
        if email is None or role is None:
            raise JWTError
        new_token = create_access_token({"sub": email, "role": role})
        return new_token
    except JWTError:
        return {"error": "Invalid token"}

def authenticate_user(email: str, password: str):
    """Autentica un utente tramite email e password."""
    db = SessionLocal()
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return None
    if not verify_password(password, user.password):
        return None
    # Genera il token JWT
    token = create_access_token({"sub": user.email, "role": user.role})
    return {"access_token": token, "user": {"id": user.id, "name": user.name, "role": user.role}}

def register_user(name: str, email: str, password: str, role: str):
    """Registra un nuovo utente."""
    db = SessionLocal()
    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        return {"error": "Email already registered"}
    
    hashed_password = hash_password(password)
    new_user = User(name=name, email=email, password=hashed_password, role=role)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"status": "success", "user_id": new_user.id}