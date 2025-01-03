from src.models.user_model import User
from sqlalchemy.orm import Session
from jose import jwt

# Chiave segreta e algoritmo per la generazione del token JWT
SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"

# Funzione per autenticare l'utente
def authenticate_user(username: str, password: str):
    # Mock user lookup
    if username == "test" and password == "password":
        # Generazione del token JWT
        return jwt.encode({"sub": username}, SECRET_KEY, algorithm=ALGORITHM)
    return None
