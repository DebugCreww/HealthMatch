from fastapi import APIRouter
from ..controllers.notification_controller import router as notification_controller

router = APIRouter()

# Includiamo il router del controller con il prefisso /api/v1
router.include_router(notification_controller, prefix="/api/v1", tags=["Notifications"])