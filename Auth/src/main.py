from fastapi import FastAPI
from src.routes.auth_routes import router as auth_router

app = FastAPI()

app.include_router(auth_router)

@app.get("/")
def read_root():
    return {"message": "Auth Service is running"}
