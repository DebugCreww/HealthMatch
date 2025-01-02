from fastapi import APIRouter, HTTPException
import httpx

router = APIRouter()

BASE_URL = "http://booking-service:8000/api/v1/bookings"

@router.post("/")
async def create_booking(booking: dict):
    async with httpx.AsyncClient() as client:
        response = await client.post(f"{BASE_URL}/", json=booking)
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.json())
        return response.json()

@router.get("/{booking_id}")
async def get_booking(booking_id: int):
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{BASE_URL}/{booking_id}")
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.json())
        return response.json()

@router.put("/{booking_id}")
async def update_booking(booking_id: int, booking_update: dict):
    async with httpx.AsyncClient() as client:
        response = await client.put(f"{BASE_URL}/{booking_id}", json=booking_update)
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.json())
        return response.json()
