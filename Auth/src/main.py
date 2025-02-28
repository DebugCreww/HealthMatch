# filepath: /path/to/src/main.py
from fastapi import FastAPI
from src.routes.auth_routes import router as auth_router
from src.middlewares.auth_middleware import AuthMiddleware
from src.db.session import Base, engine

# Creazione dell'app FastAPI
app = FastAPI()

# Inclusione del middleware di autenticazione
app.add_middleware(AuthMiddleware)

# Inclusione del router per le rotte di autenticazione
app.include_router(auth_router)

# Creazione delle tabelle del database
Base.metadata.create_all(bind=engine)

# Rotta di base per verificare se il servizio di autenticazione è in esecuzione
@app.get("/")
def read_root():
    return {"message": "Auth Service is running"}