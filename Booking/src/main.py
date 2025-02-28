from fastapi import FastAPI
from src.routes.booking_routes import router as booking_router

# Rimuovi questa importazione che causa errore
# from Auth.src.middlewares.auth_middleware import AuthMiddleware

app = FastAPI()

# Commenta o rimuovi questa riga
# app.add_middleware(AuthMiddleware)

# Inclusione del router per le rotte di prenotazione
app.include_router(booking_router)

# Rotta di base per verificare se il servizio di prenotazione è in esecuzione
@app.get("/")
def read_root():
    return {"message": "Booking Service is running"}
