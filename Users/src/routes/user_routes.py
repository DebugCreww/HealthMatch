from fastapi import APIRouter
from src.controllers.user_controller import router as user_router

# Creazione di un router per le rotte di gestione utenti
router = APIRouter()
# Inclusione del router del controller di gestione utenti con prefisso e tag
router.include_router(user_router, prefix="/users", tags=["User Management"])