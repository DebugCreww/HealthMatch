from fastapi import APIRouter
from src.controllers.booking_controller import router as booking_router

router = APIRouter()
router.include_router(booking_router, prefix="/api/v1", tags=["Booking"])
