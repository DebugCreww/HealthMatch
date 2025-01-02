from fastapi import APIRouter, HTTPException
import httpx

router = APIRouter()

@router.get("/auth/login")
async def login_via_gateway(username: str, password: str):
    async with httpx.AsyncClient() as client:
        response = await client.post("http://auth-service:8001/auth/login", json={"username": username, "password": password})
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.json())
        return response.json()
