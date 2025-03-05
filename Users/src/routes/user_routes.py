from fastapi import APIRouter
from ..controllers.user_controller import router as user_controller

router = APIRouter()

# Includiamo il router del controller con il prefisso /api/v1
router.include_router(user_controller, prefix="/api/v1", tags=["Users"])