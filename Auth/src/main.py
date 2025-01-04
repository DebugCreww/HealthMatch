from fastapi import FastAPI
from src.routes.auth_routes import router as auth_router
from src.middlewares.auth_middleware import AuthMiddleware

# Creazione dell'app FastAPI
app = FastAPI()

# Inclusione del middleware di autenticazione
app.add_middleware(AuthMiddleware)

# Inclusione del router per le rotte di autenticazione
app.include_router(auth_router)

# Rotta di base per verificare se il servizio di autenticazione è in esecuzione
@app.get("/")
def read_root():
    return {"message": "Auth Service is running"}