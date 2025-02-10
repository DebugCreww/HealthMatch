from fastapi import APIRouter
from src.controllers.service_controller import router as service_router

router = APIRouter()
router.include_router(service_router, prefix="/api/v1", tags=["Service Catalog"])