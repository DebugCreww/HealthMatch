from fastapi import APIRouter, HTTPException, Depends, Path, Query, Body
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
from ..models.notification_model import Notification, NotificationCreate, NotificationResponse, SessionLocal
from ..db.session import get_db
from ..services.notification_service import (
    create_notification, 
    get_user_notifications, 
    mark_notification_as_read,
    get_notification_by_id,
    delete_notification,
    get_unread_count
)
import datetime
import json

router = APIRouter()

@router.post("/", response_model=Dict[str, Any])
async def create_notification_endpoint(notification_data: NotificationCreate, db: Session = Depends(get_db)):
    """Crea una nuova notifica."""
    result = create_notification(db, notification_data)
    return {
        "status": "success",
        "message": "Notification created successfully",
        "data": result
    }

@router.get("/user/{user_id}", response_model=List[NotificationResponse])
async def get_user_notifications_endpoint(
    user_id: int = Path(..., description="ID dell'utente"),
    skip: int = Query(0, description="Numero di record da saltare"),
    limit: int = Query(100, description="Numero massimo di record da restituire"),
    unread_only: bool = Query(False, description="Filtra solo notifiche non lette"),
    db: Session = Depends(get_db)
):
    """Ottiene tutte le notifiche di un utente."""
    notifications = get_user_notifications(db, user_id, skip, limit, unread_only)
    return notifications

@router.get("/user/{user_id}/count", response_model=Dict[str, int])
async def get_unread_count_endpoint(
    user_id: int = Path(..., description="ID dell'utente"),
    db: Session = Depends(get_db)
):
    """Ottiene il conteggio delle notifiche non lette di un utente."""
    count = get_unread_count(db, user_id)
    return {"unread_count": count}

@router.get("/{notification_id}", response_model=NotificationResponse)
async def get_notification_endpoint(
    notification_id: int = Path(..., description="ID della notifica"),
    db: Session = Depends(get_db)
):
    """Ottiene una notifica specifica per ID."""
    notification = get_notification_by_id(db, notification_id)
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    return notification

@router.patch("/{notification_id}/read", response_model=Dict[str, Any])
async def mark_as_read_endpoint(
    notification_id: int = Path(..., description="ID della notifica"),
    data: Dict[str, Any] = Body(..., description="Dati per aggiornare lo stato di lettura"),
    db: Session = Depends(get_db)
):
    """Segna una notifica come letta."""
    if "user_id" not in data:
        raise HTTPException(status_code=400, detail="user_id is required")
    
    result = mark_notification_as_read(db, notification_id, data["user_id"])
    if not result:
        raise HTTPException(status_code=404, detail="Notification not found or not authorized")
    
    return {
        "status": "success", 
        "message": "Notification marked as read", 
        "read_at": datetime.datetime.utcnow().isoformat()
    }

@router.delete("/{notification_id}", response_model=Dict[str, Any])
async def delete_notification_endpoint(
    notification_id: int = Path(..., description="ID della notifica"),
    user_id: int = Query(..., description="ID dell'utente"),
    db: Session = Depends(get_db)
):
    """Elimina una notifica."""
    result = delete_notification(db, notification_id, user_id)
    if not result:
        raise HTTPException(status_code=404, detail="Notification not found or not authorized")
    
    return {"status": "success", "message": "Notification deleted successfully"}

def create_notification(notification_data):
    """Crea una nuova notifica."""
    db = SessionLocal()
    try:
        # Converti metadata in JSON se è un dizionario
        if isinstance(notification_data.get("meta_data"), dict):
            notification_data["meta_data"] = json.dumps(notification_data["meta_data"])

        notification = Notification(
            recipient_id=notification_data["recipient_id"],
            sender_id=notification_data.get("sender_id"),
            type=notification_data["type"],
            title=notification_data["title"],
            content=notification_data["content"],
            meta_data=notification_data.get("meta_data"),  # Aggiornato da metadata a meta_data
            is_read=notification_data.get("is_read", False)
        )
        db.add(notification)
        db.commit()
        db.refresh(notification)
        return {"id": notification.id}
    except Exception as e:
        db.rollback()
        return {"error": str(e)}
    finally:
        db.close()

def get_user_notifications(user_id, limit=10, offset=0):
    """Ottiene le notifiche di un utente."""
    db = SessionLocal()
    try:
        notifications = db.query(Notification)\
            .filter(Notification.recipient_id == user_id)\
            .order_by(Notification.created_at.desc())\
            .limit(limit)\
            .offset(offset)\
            .all()
        
        result = []
        for n in notifications:
            notification_dict = {
                "id": n.id,
                "recipient_id": n.recipient_id,
                "sender_id": n.sender_id,
                "type": n.type,
                "title": n.title,
                "content": n.content,
                "meta_data": n.meta_data,  # Aggiornato da metadata a meta_data
                "is_read": n.is_read,
                "created_at": n.created_at.isoformat() if n.created_at else None
            }
            
            # Converti meta_data da JSON a dizionario se è una stringa JSON
            if n.meta_data and isinstance(n.meta_data, str):
                try:
                    notification_dict["meta_data"] = json.loads(n.meta_data)
                except json.JSONDecodeError:
                    pass
                
            result.append(notification_dict)
            
        return result
    finally:
        db.close()

def mark_as_read(notification_id):
    """Marca una notifica come letta."""
    db = SessionLocal()
    try:
        notification = db.query(Notification).filter(Notification.id == notification_id).first()
        if not notification:
            return {"error": "Notification not found"}
        
        notification.is_read = True
        notification.updated_at = datetime.now()
        db.commit()
        return {"success": True}
    except Exception as e:
        db.rollback()
        return {"error": str(e)}
    finally:
        db.close()