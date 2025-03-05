from fastapi import APIRouter
from ..controllers.catalog_controller import router as catalog_controller

router = APIRouter()

# Includiamo il router del controller con il prefisso /api/v1
router.include_router(catalog_controller, prefix="/api/v1")