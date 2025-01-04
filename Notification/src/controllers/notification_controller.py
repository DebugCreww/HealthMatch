from src.services.email_service import send_email
from src.services.log_service import save_notification_log, get_notification_logs

def log_notification(recipient: str, subject: str, body: str):
    save_notification_log(recipient, subject, body)

def retrieve_logs():
    return get_notification_logs()

async def send_email_notification(email_data: dict):
    """
    Controller per inviare una notifica via email.
    """
    recipient = email_data.get("recipient")
    subject = email_data.get("subject")
    body = email_data.get("body")
    if not recipient or not subject or not body:
        return {"error": "Recipient, subject, and body are required"}
    
    result = send_email(recipient, subject, body)
    return result
