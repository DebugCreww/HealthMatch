from sqlalchemy.orm import Session
import datetime
import json
import logging
from typing import List, Optional
from ..models.notification_model import Notification, NotificationCreate

# Logger configuration
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_notification(db: Session, notification_data: NotificationCreate) -> Notification:
    """Crea una nuova notifica nel database."""
    try:
        notification = Notification(
            recipient_id=notification_data.recipient_id,
            sender_id=notification_data.sender_id,
            title=notification_data.title,
            content=notification_data.content,  # Corretto da message a content
            type=notification_data.type,
            meta_data=notification_data.meta_data  # Corretto da metadata a meta_data
        )
        
        db.add(notification)
        db.commit()
        db.refresh(notification)
        
        logger.info(f"Notification created for user {notification_data.recipient_id}: {notification_data.title}")
        return notification
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating notification: {str(e)}")
        raise

def get_user_notifications(
    db: Session, 
    user_id: int, 
    skip: int = 0, 
    limit: int = 100,
    unread_only: bool = False
) -> List[Notification]:
    """Ottiene tutte le notifiche di un utente."""
    query = db.query(Notification).filter(Notification.recipient_id == user_id)
    
    if unread_only:
        query = query.filter(Notification.is_read == False)  # Corretto da read a is_read
    
    notifications = query.order_by(Notification.created_at.desc()).offset(skip).limit(limit).all()
    return notifications

def get_notification_by_id(db: Session, notification_id: int) -> Optional[Notification]:
    """Ottiene una notifica specifica per ID."""
    return db.query(Notification).filter(Notification.id == notification_id).first()

def mark_notification_as_read(db: Session, notification_id: int, user_id: int) -> bool:
    """Segna una notifica come letta."""
    notification = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.recipient_id == user_id
    ).first()
    
    if not notification:
        return False
    
    notification.is_read = True  # Corretto da read a is_read
    notification.read_at = datetime.datetime.utcnow()
    
    try:
        db.commit()
        logger.info(f"Notification {notification_id} marked as read by user {user_id}")
        return True
    except Exception as e:
        db.rollback()
        logger.error(f"Error marking notification as read: {str(e)}")
        raise

def delete_notification(db: Session, notification_id: int, user_id: int) -> bool:
    """Elimina una notifica."""
    notification = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.recipient_id == user_id
    ).first()
    
    if not notification:
        return False
    
    try:
        db.delete(notification)
        db.commit()
        logger.info(f"Notification {notification_id} deleted by user {user_id}")
        return True
    except Exception as e:
        db.rollback()
        logger.error(f"Error deleting notification: {str(e)}")
        raise

def get_unread_count(db: Session, user_id: int) -> int:
    """Ottiene il conteggio delle notifiche non lette di un utente."""
    return db.query(Notification).filter(
        Notification.recipient_id == user_id,
        Notification.is_read == False  # Corretto da read a is_read
    ).count()

def mark_all_as_read(db: Session, user_id: int) -> int:
    """Segna tutte le notifiche di un utente come lette."""
    notifications = db.query(Notification).filter(
        Notification.recipient_id == user_id,
        Notification.is_read == False  # Corretto da read a is_read
    ).all()
    
    count = 0
    for notification in notifications:
        notification.is_read = True  # Corretto da read a is_read
        notification.read_at = datetime.datetime.utcnow()
        count += 1
    
    try:
        db.commit()
        logger.info(f"{count} notifications marked as read for user {user_id}")
        return count
    except Exception as e:
        db.rollback()
        logger.error(f"Error marking all notifications as read: {str(e)}")
        raise