# Booking/src/controllers/booking_controller.py
# Aggiornamento del controller delle prenotazioni per utilizzare il servizio integrato

from fastapi import APIRouter, HTTPException, Depends, Query, Path, Body
from sqlalchemy.orm import Session
from typing import List, Optional

from src.db.session import get_db
from src.models.booking_model import BookingSchema, BookingUpdateSchema, BookingResponse, BookingDetailResponse
from src.services.integrated_booking_service import get_integrated_booking_service, IntegratedBookingService
from src.middleware.auth_middleware import get_current_user

# Creazione di un router per il controller di prenotazione
router = APIRouter()

# Rotta per creare una nuova prenotazione
@router.post("/", response_model=BookingResponse)
async def create_new_booking(
    booking: BookingSchema, 
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Crea una nuova prenotazione.
    Richiede autenticazione e l'utente deve essere il cliente o un admin.
    """
    user_id = current_user.get("sub")
    
    # Verifica se l'utente è autorizzato (deve essere il cliente o un admin)
    if booking.client_id != user_id and current_user.get("role") != "admin":
        raise HTTPException(
            status_code=403, 
            detail="Non sei autorizzato a creare prenotazioni per altri utenti"
        )
    
    booking_service = get_integrated_booking_service(db)
    try:
        result = await booking_service.create_booking(booking, user_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Impossibile creare la prenotazione: {str(e)}")

# Rotta per ottenere i dettagli di una prenotazione esistente
@router.get("/{booking_id}", response_model=BookingDetailResponse)
async def get_booking_details(
    booking_id: int = Path(..., description="ID della prenotazione"),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Recupera i dettagli di una prenotazione specifica.
    L'utente deve essere coinvolto nella prenotazione o un admin.
    """
    user_id = current_user.get("sub")
    
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Prenotazione non trovata")
    
    # Verifica se l'utente è autorizzato a visualizzare questa prenotazione
    if booking.client_id != user_id and booking.professional_id != user_id and current_user.get("role") != "admin":
        raise HTTPException(
            status_code=403, 
            detail="Non sei autorizzato a visualizzare questa prenotazione"
        )
    
    booking_service = get_integrated_booking_service(db)
    # Qui potremmo utilizzare un metodo del servizio per recuperare i dettagli completi
    # Per ora, restituiamo solo l'oggetto booking

    # Simula il recupero di informazioni aggiuntive
    result = {
        **booking.__dict__,
        "client_name": "Nome Cliente",  # In un'implementazione reale, recupereremmo questo dal servizio utenti
        "professional_name": "Nome Professionista",
        "service_name": "Nome Servizio",
        "service_duration": 30
    }
    
    return result

# Rotta per ottenere le prenotazioni di un utente
@router.get("/user/{user_id}", response_model=List[BookingResponse])
async def get_user_bookings_list(
    user_id: int = Path(..., description="ID dell'utente"),
    status: Optional[str] = Query(None, description="Filtra per stato della prenotazione"),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Recupera l'elenco delle prenotazioni di un utente.
    L'utente deve richiedere le proprie prenotazioni o essere un admin.
    """
    logged_user_id = current_user.get("sub")
    
    # Verifica se l'utente è autorizzato
    if str(user_id) != logged_user_id and current_user.get("role") != "admin":
        raise HTTPException(
            status_code=403, 
            detail="Non sei autorizzato a visualizzare le prenotazioni di altri utenti"
        )
    
    booking_service = get_integrated_booking_service(db)
    try:
        bookings = await booking_service.get_user_bookings(user_id, status)
        return bookings
    except Exception as e:
        raise HTTPException(
            status_code=400, 
            detail=f"Impossibile recuperare le prenotazioni: {str(e)}"
        )

# Rotta per aggiornare lo stato di una prenotazione esistente
@router.put("/{booking_id}", response_model=BookingResponse)
async def update_booking_status(
    booking_id: int = Path(..., description="ID della prenotazione"),
    booking_update: BookingUpdateSchema = Body(...),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Aggiorna lo stato o i dettagli di una prenotazione esistente.
    L'utente deve essere coinvolto nella prenotazione o un admin.
    """
    user_id = current_user.get("sub")
    
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Prenotazione non trovata")
    
    # Verifica se l'utente è autorizzato a modificare questa prenotazione
    if booking.client_id != user_id and booking.professional_id != user_id and current_user.get("role") != "admin":
        raise HTTPException(
            status_code=403, 
            detail="Non sei autorizzato a modificare questa prenotazione"
        )
    
    booking_service = get_integrated_booking_service(db)
    try:
        if booking_update.status:
            result = await booking_service.update_booking_status(
                booking_id, 
                booking_update.status, 
                user_id
            )
        else:
            # Qui potremmo implementare l'aggiornamento di altri campi
            result = {"error": "Aggiornamento non supportato"}
            
        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])
        
        return result
    except Exception as e:
        raise HTTPException(
            status_code=400, 
            detail=f"Impossibile aggiornare la prenotazione: {str(e)}"
        )

# Rotta per eliminare una prenotazione esistente
@router.delete("/{booking_id}", response_model=dict)
async def delete_booking_record(
    booking_id: int = Path(..., description="ID della prenotazione"),
    reason: Optional[str] = Query(None, description="Motivo della cancellazione"),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Elimina (cancella) una prenotazione esistente.
    In realtà, imposta lo stato su 'cancelled' anziché eliminare il record.
    L'utente deve essere coinvolto nella prenotazione o un admin.
    """
    user_id = current_user.get("sub")
    
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Prenotazione non trovata")
    
    # Verifica se l'utente è autorizzato a cancellare questa prenotazione
    if booking.client_id != user_id and booking.professional_id != user_id and current_user.get("role") != "admin":
        raise HTTPException(
            status_code=403, 
            detail="Non sei autorizzato a cancellare questa prenotazione"
        )
    
    # In una vera applicazione, potremmo avere regole diverse per la cancellazione
    # Ad esempio, non permettere la cancellazione se mancano meno di 24 ore
    hours_to_appointment = (booking.date_time - datetime.utcnow()).total_seconds() / 3600
    if hours_to_appointment < 24 and booking.client_id == user_id and current_user.get("role") != "admin":
        raise HTTPException(
            status_code=400,
            detail="Non è possibile cancellare un appuntamento con meno di 24 ore di preavviso"
        )
    
    booking_service = get_integrated_booking_service(db)
    try:
        # Impostiamo lo stato su 'cancelled' anziché eliminare il record
        update_data = BookingUpdateSchema(
            status="cancelled",
            cancellation_reason=reason
        )
        
        result = await booking_service.update_booking_status(
            booking_id,
            "cancelled",
            user_id
        )
        
        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])
        
        return {"message": "Prenotazione cancellata con successo", "id": booking_id}
    except Exception as e:
        raise HTTPException(
            status_code=400, 
            detail=f"Impossibile cancellare la prenotazione: {str(e)}"
        )