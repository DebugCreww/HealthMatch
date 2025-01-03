from fastapi import APIRouter
from src.controllers.notification_controller import send_notification

router = APIRouter()

@router.post("/notifications/")
async def send_notification_route(notification: dict):
    """
    API endpoint to send notifications to Slack.
    """
    return await send_notification(notification)
