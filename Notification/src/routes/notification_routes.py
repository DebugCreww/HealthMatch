from fastapi import APIRouter
from src.controllers.notification_controller import send_email_notification, retrieve_logs

router = APIRouter()

@router.post("/notifications/email")
async def send_email_route(email_data: dict):
    """
    API endpoint per inviare email.
    """
    return await send_email_notification(email_data)

@router.get("/notifications/logs")
async def get_notification_logs_route():
    """
    API endpoint per recuperare lo storico delle notifiche.
    """
    logs = retrieve_logs()
    return {"logs": [log.__dict__ for log in logs]}
