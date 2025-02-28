from sqlalchemy.orm import Session
from src.models.user_model import User
from typing import List, Optional

def create_user(db: Session, username: str, email: str, password_hash: str, role: str) -> int:
    """Crea un nuovo utente."""
    new_user = User(username=username, email=email, password_hash=password_hash, role=role)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user.id

def get_user(db: Session, user_id: int) -> Optional[User]:
    """Restituisce un utente specifico per ID."""
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """Restituisce un utente specifico per email."""
    return db.query(User).filter(User.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 100) -> List[User]:
    """Restituisce tutti gli utenti con paginazione."""
    return db.query(User).offset(skip).limit(limit).all()

def update_user(db: Session, user_id: int, user_data: dict) -> bool:
    """Aggiorna un utente esistente."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return False
    
    for key, value in user_data.items():
        setattr(user, key, value)
    
    db.commit()
    db.refresh(user)
    return True

def delete_user(db: Session, user_id: int) -> bool:
    """Elimina un utente esistente."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return False
    
    db.delete(user)
    db.commit()
    return True

def get_professionals(db: Session, category: Optional[str] = None, location: Optional[str] = None) -> List[User]:
    """Restituisce professionisti con filtri opzionali."""
    query = db.query(User).filter(User.role == "professional")
    
    if category:
        query = query.filter(User.category == category)
    if location:
        query = query.filter(User.location == location)
    
    return query.all()