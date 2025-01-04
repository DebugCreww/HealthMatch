from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from src.models.user_model import User
from src.db.session import get_db
from Auth.src.services.auth_service import hash_password
from pydantic import BaseModel, EmailStr
from typing import List, Optional

# Creazione del router
router = APIRouter()

# Schemi per le richieste
class UserUpdateSchema(BaseModel):
    name: str = None
    email: EmailStr = None
    password: str = None

# Schemi per le risposte
class UserResponseSchema(BaseModel):
    id: int
    name: str
    email: str
    role: str
    category: Optional[str] = None
    rating: Optional[float] = None

# Rotta per visualizzare il profilo utente
@router.get("/{user_id}")
def get_user_profile(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"id": user.id, "name": user.name, "email": user.email, "role": user.role}

# Rotta per aggiornare il profilo utente
@router.put("/{user_id}")
def update_user_profile(user_id: int, user_update: UserUpdateSchema, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user_update.name:
        user.name = user_update.name
    if user_update.email:
        user.email = user_update.email
    if user_update.password:
        user.password = hash_password(user_update.password)
    
    db.commit()
    db.refresh(user)
    return {"message": "User profile updated successfully"}

# Rotta per eliminare il profilo utente
@router.delete("/{user_id}")
def delete_user_profile(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db.delete(user)
    db.commit()
    return {"message": "User profile deleted successfully"}

# Rotta per elencare i professionisti
@router.get("/professionals", response_model=List[UserResponseSchema])
def list_professionals(
    category: Optional[str] = Query(None),
    location: Optional[str] = Query(None),
    rating: Optional[float] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(User).filter(User.role == "professional")
    
    if category:
        query = query.filter(User.category == category)
    if location:
        query = query.filter(User.location == location)
    if rating:
        query = query.filter(User.rating >= rating)
    
    professionals = query.all()
    return professionals

# Rotta per cercare utenti
@router.get("/search", response_model=List[UserResponseSchema])
def search_users(
    name: Optional[str] = Query(None),
    role: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(User)
    
    if name:
        query = query.filter(User.name.ilike(f"%{name}%"))
    if role:
        query = query.filter(User.role == role)
    
    users = query.all()
    return users

# Rotta per ottenere le statistiche degli utenti
@router.get("/stats")
def get_user_stats(db: Session = Depends(get_db)):
    total_users = db.query(func.count(User.id)).scalar()
    total_clients = db.query(func.count(User.id)).filter(User.role == "client").scalar()
    total_professionals = db.query(func.count(User.id)).filter(User.role == "professional").scalar()
    return {
        "total_users": total_users,
        "total_clients": total_clients,
        "total_professionals": total_professionals
    }