from fastapi import APIRouter, HTTPException, Depends
from src.services.booking_service import create_booking, get_booking, update_booking
from src.models.booking_model import BookingSchema, BookingUpdateSchema

router = APIRouter()

@router.post("/bookings/")
def create_new_booking(booking: BookingSchema):
    booking_id = create_booking(booking)
    if not booking_id:
        raise HTTPException(status_code=400, detail="Unable to create booking")
    return {"booking_id": booking_id}

@router.get("/bookings/{booking_id}")
def get_booking_details(booking_id: int):
    booking = get_booking(booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return booking

@router.put("/bookings/{booking_id}")
def update_booking_details(booking_id: int, booking_update: BookingUpdateSchema):
    updated = update_booking(booking_id, booking_update)
    if not updated:
        raise HTTPException(status_code=400, detail="Unable to update booking")
    return {"message": "Booking updated successfully"}
