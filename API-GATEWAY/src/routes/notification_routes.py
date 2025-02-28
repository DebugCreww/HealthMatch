from fastapi import APIRouter
import httpx

router = APIRouter()

@router.post("/notifications/")
async def send_notification(notification: dict):
    """
    Route to forward notifications to the Notification-Service.
    """
    async with httpx.AsyncClient() as client:
        response = await client.post("http://notification-service:8007/notifications/", json=notification)
        return response.json()
