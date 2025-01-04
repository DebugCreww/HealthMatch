from fastapi import APIRouter
from src.controllers.booking_controller import router as booking_router

# Creazione di un router per le rotte di prenotazione
router = APIRouter()
# Inclusione del router del controller di prenotazione con prefisso e tag
router.include_router(booking_router, prefix="/api/v1", tags=["Booking"])