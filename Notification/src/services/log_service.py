from src.models.notification_model import NotificationLog, SessionLocal

def save_notification_log(recipient: str, subject: str, body: str):
    """
    Salva una notifica nel log.
    """
    db = SessionLocal()
    new_log = NotificationLog(recipient=recipient, subject=subject, body=body)
    db.add(new_log)
    db.commit()
    db.close()

def get_notification_logs():
    """
    Recupera tutte le notifiche salvate.
    """
    db = SessionLocal()
    logs = db.query(NotificationLog).all()
    db.close()
    return logs
