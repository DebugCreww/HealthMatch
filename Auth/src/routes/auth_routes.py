from fastapi import APIRouter
from src.controllers.auth_controller import router as auth_router

# Creazione di un router per le rotte di autenticazione
router = APIRouter()
# Inclusione del router del controller di autenticazione con prefisso e tag
router.include_router(auth_router, prefix="/auth", tags=["Authentication"])