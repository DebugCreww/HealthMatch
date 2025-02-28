from sqlalchemy import create_engine
from src.routes.service_routes import router as service_router
from sqlalchemy.orm import sessionmaker
from fastapi import FastAPI
app = FastAPI()
# Aggiungi rotte, middleware, ecc.

# Inclusione del router per le rotte del catalogo
app.include_router(service_router)

DATABASE_URL = "sqlite:///./catalog.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Rotta di base per verificare se il servizio di catalogo è in esecuzione
@app.get("/")
def read_root():
    return {"message": "Catalog Service is running"}