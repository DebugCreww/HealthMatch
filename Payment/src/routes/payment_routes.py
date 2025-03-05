from fastapi import APIRouter
from src.controllers.payment_controller import router as payment_router

router = APIRouter()
router.include_router(payment_router, prefix="/api/v1", tags=["Payments"])