from fastapi import FastAPI
from src.routes.user_routes import router as user_router

# Creazione dell'app FastAPI
app = FastAPI()

# Inclusione del router per le rotte di gestione utenti
app.include_router(user_router)

# Rotta di base per verificare se il servizio di gestione utenti è in esecuzione
@app.get("/")
def read_root():
    return {"message": "User Service is running"}