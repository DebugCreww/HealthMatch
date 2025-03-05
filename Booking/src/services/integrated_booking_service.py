# Booking/src/services/integrated_booking_service.py
# Questo file implementa un servizio integrato di prenotazione che utilizza
# il servizio di notifica per inviare conferme e promemoria

import httpx
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from src.models.booking_model import Booking, BookingSchema, BookingUpdateSchema
import json
import logging
from typing import Dict, Any, List, Optional

# Configurazione logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configurazione degli URL dei servizi
NOTIFICATION_SERVICE_URL = "http://notification-service:8004/api/v1"
PAYMENT_SERVICE_URL = "http://payment-service:8005/api/v1"
USER_SERVICE_URL = "http://users-service:8006/api/v1"

class IntegratedBookingService:
    def __init__(self, db_session: Session):
        self.db_session = db_session
        
    async def create_booking(self, booking_data: BookingSchema, user_id: int) -> Dict[str, Any]:
        """
        Crea una prenotazione e invia le notifiche a cliente e professionista.
        Restituisce la prenotazione creata.
        """
        try:
            # 1. Salva la prenotazione nel database
            new_booking = Booking(**booking_data.dict())
            self.db_session.add(new_booking)
            self.db_session.commit()
            self.db_session.refresh(new_booking)
            
            # 2. Ottieni informazioni su cliente e professionista per le notifiche
            client_info = await self._get_user_info(booking_data.client_id)
            professional_info = await self._get_user_info(booking_data.professional_id)
            service_info = await self._get_service_info(booking_data.service_id)
            
            # 3. Invia notifica al cliente
            await self._send_client_notification(new_booking, client_info, professional_info, service_info)
            
            # 4. Invia notifica al professionista
            await self._send_professional_notification(new_booking, client_info, professional_info, service_info)
            
            # 5. Programma un promemoria per il giorno prima dell'appuntamento
            await self._schedule_reminder(new_booking, client_info, professional_info, service_info)
            
            return {
                "id": new_booking.id,
                "client_id": new_booking.client_id,
                "professional_id": new_booking.professional_id,
                "service_id": new_booking.service_id,
                "date_time": new_booking.date_time.isoformat(),
                "status": new_booking.status,
                "message": "Prenotazione creata con successo"
            }
            
        except Exception as e:
            self.db_session.rollback()
            logger.error(f"Errore durante la creazione della prenotazione: {str(e)}")
            raise
    
    async def update_booking_status(self, booking_id: int, new_status: str, user_id: int) -> Dict[str, Any]:
        """
        Aggiorna lo stato di una prenotazione e invia le notifiche appropriate.
        """
        try:
            # 1. Recupera la prenotazione dal database
            booking = self.db_session.query(Booking).filter(Booking.id == booking_id).first()
            if not booking:
                return {"error": "Prenotazione non trovata"}
            
            # 2. Verifica autorizzazione (solo il cliente, il professionista o un admin possono modificare)
            if user_id != booking.client_id and user_id != booking.professional_id:
                # Qui potremmo verificare se l'utente è un admin, ma per semplicità non lo facciamo
                return {"error": "Non autorizzato a modificare questa prenotazione"}
            
            old_status = booking.status
            
            # 3. Aggiorna lo stato
            booking.status = new_status
            self.db_session.commit()
            self.db_session.refresh(booking)
            
            # 4. Ottieni informazioni per le notifiche
            client_info = await self._get_user_info(booking.client_id)
            professional_info = await self._get_user_info(booking.professional_id)
            service_info = await self._get_service_info(booking.service_id)
            
            # 5. Invia notifiche appropriate in base al cambio di stato
            if old_status != new_status:
                if new_status == "confirmed":
                    await self._send_confirmation_notifications(booking, client_info, professional_info, service_info)
                elif new_status == "cancelled":
                    await self._send_cancellation_notifications(booking, client_info, professional_info, service_info)
                elif new_status == "completed":
                    await self._send_completion_notifications(booking, client_info, professional_info, service_info)
            
            return {
                "id": booking.id,
                "status": booking.status,
                "message": f"Stato prenotazione aggiornato a '{new_status}'"
            }
            
        except Exception as e:
            self.db_session.rollback()
            logger.error(f"Errore durante l'aggiornamento della prenotazione: {str(e)}")
            raise
    
    async def get_user_bookings(self, user_id: int, status: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Recupera tutte le prenotazioni di un utente (sia come cliente che come professionista)
        con possibilità di filtrare per stato.
        """
        try:
            query = self.db_session.query(Booking).filter(
                (Booking.client_id == user_id) | (Booking.professional_id == user_id)
            )
            
            if status:
                query = query.filter(Booking.status == status)
            
            bookings = query.order_by(Booking.date_time.desc()).all()
            
            result = []
            for booking in bookings:
                # Recupera dettagli aggiuntivi per ogni prenotazione
                client_info = await self._get_user_info(booking.client_id)
                professional_info = await self._get_user_info(booking.professional_id)
                service_info = await self._get_service_info(booking.service_id)
                
                result.append({
                    "id": booking.id,
                    "client_id": booking.client_id,
                    "client_name": client_info.get("name", "Cliente Sconosciuto"),
                    "professional_id": booking.professional_id,
                    "professional_name": professional_info.get("name", "Professionista Sconosciuto"),
                    "service_id": booking.service_id,
                    "service_name": service_info.get("name", "Servizio Sconosciuto"),
                    "date_time": booking.date_time.isoformat(),
                    "status": booking.status,
                    "payment_status": booking.payment_status,
                    "amount": booking.amount,
                    "is_client": booking.client_id == user_id
                })
            
            return result
            
        except Exception as e:
            logger.error(f"Errore durante il recupero delle prenotazioni: {str(e)}")
            raise
    
    # Metodi privati per operazioni di supporto
    
    async def _get_user_info(self, user_id: int) -> Dict[str, Any]:
        """Recupera informazioni sull'utente dal servizio utenti."""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(f"{USER_SERVICE_URL}/users/{user_id}")
                if response.status_code == 200:
                    return response.json()
                return {"id": user_id, "name": "Utente sconosciuto"}
        except Exception as e:
            logger.warning(f"Impossibile recuperare informazioni utente {user_id}: {str(e)}")
            return {"id": user_id, "name": "Utente sconosciuto"}
    
    async def _get_service_info(self, service_id: int) -> Dict[str, Any]:
        """Recupera informazioni sul servizio dal catalogo."""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(f"http://catalog-service:8003/api/v1/services/{service_id}")
                if response.status_code == 200:
                    return response.json()
                return {"id": service_id, "name": "Servizio sconosciuto"}
        except Exception as e:
            logger.warning(f"Impossibile recuperare informazioni servizio {service_id}: {str(e)}")
            return {"id": service_id, "name": "Servizio sconosciuto"}
    
    async def _send_client_notification(self, booking, client_info, professional_info, service_info):
        """Invia una notifica al cliente per la prenotazione creata."""
        try:
            appointment_date = booking.date_time.strftime("%d/%m/%Y alle ore %H:%M")
            notification_data = {
                "recipient_id": booking.client_id,
                "title": "Prenotazione effettuata",
                "content": f"Hai prenotato un appuntamento con {professional_info.get('name')} per {service_info.get('name')} il {appointment_date}.",
                "type": "booking_created",
                "meta_data": json.dumps({
                    "booking_id": booking.id,
                    "professional_id": booking.professional_id,
                    "service_id": booking.service_id,
                    "date_time": booking.date_time.isoformat()
                })
            }
            
            async with httpx.AsyncClient() as client:
                await client.post(f"{NOTIFICATION_SERVICE_URL}/", json=notification_data)
        except Exception as e:
            logger.warning(f"Errore nell'invio della notifica al cliente: {str(e)}")
    
    async def _send_professional_notification(self, booking, client_info, professional_info, service_info):
        """Invia una notifica al professionista per la nuova prenotazione."""
        try:
            appointment_date = booking.date_time.strftime("%d/%m/%Y alle ore %H:%M")
            notification_data = {
                "recipient_id": booking.professional_id,
                "title": "Nuova prenotazione",
                "content": f"Hai ricevuto una nuova prenotazione da {client_info.get('name')} per {service_info.get('name')} il {appointment_date}.",
                "type": "new_booking",
                "meta_data": json.dumps({
                    "booking_id": booking.id,
                    "client_id": booking.client_id,
                    "service_id": booking.service_id,
                    "date_time": booking.date_time.isoformat()
                })
            }
            
            async with httpx.AsyncClient() as client:
                await client.post(f"{NOTIFICATION_SERVICE_URL}/", json=notification_data)
        except Exception as e:
            logger.warning(f"Errore nell'invio della notifica al professionista: {str(e)}")
    
    async def _schedule_reminder(self, booking, client_info, professional_info, service_info):
        """Programma un promemoria per il giorno prima dell'appuntamento."""
        # In un sistema reale, qui utilizzeremmo un sistema di task scheduling come Celery
        # Per ora simuliamo l'invio di un promemoria
        try:
            # In una implementazione reale, qui programmeremmo un task per inviare la notifica
            # il giorno prima dell'appuntamento
            pass
        except Exception as e:
            logger.warning(f"Errore nella programmazione del promemoria: {str(e)}")
    
    async def _send_confirmation_notifications(self, booking, client_info, professional_info, service_info):
        """Invia notifiche quando una prenotazione viene confermata."""
        try:
            appointment_date = booking.date_time.strftime("%d/%m/%Y alle ore %H:%M")
            
            # Notifica al cliente
            notification_data = {
                "recipient_id": booking.client_id,
                "title": "Prenotazione confermata",
                "content": f"La tua prenotazione con {professional_info.get('name')} per {service_info.get('name')} il {appointment_date} è stata confermata.",
                "type": "booking_confirmed",
                "meta_data": json.dumps({
                    "booking_id": booking.id,
                    "date_time": booking.date_time.isoformat()
                })
            }
            
            async with httpx.AsyncClient() as client:
                await client.post(f"{NOTIFICATION_SERVICE_URL}/", json=notification_data)
        except Exception as e:
            logger.warning(f"Errore nell'invio della notifica di conferma: {str(e)}")
    
    async def _send_cancellation_notifications(self, booking, client_info, professional_info, service_info):
        """Invia notifiche quando una prenotazione viene annullata."""
        try:
            appointment_date = booking.date_time.strftime("%d/%m/%Y alle ore %H:%M")
            
            # Se l'annullamento è stato fatto dal professionista, notifica il cliente
            if booking.client_id != booking.last_updated_by:
                notification_data = {
                    "recipient_id": booking.client_id,
                    "title": "Prenotazione annullata",
                    "content": f"La tua prenotazione con {professional_info.get('name')} per {service_info.get('name')} il {appointment_date} è stata annullata.",
                    "type": "booking_cancelled",
                    "meta_data": json.dumps({
                        "booking_id": booking.id,
                        "date_time": booking.date_time.isoformat()
                    })
                }
                
                async with httpx.AsyncClient() as client:
                    await client.post(f"{NOTIFICATION_SERVICE_URL}/", json=notification_data)
            
            # Se l'annullamento è stato fatto dal cliente, notifica il professionista
            else:
                notification_data = {
                    "recipient_id": booking.professional_id,
                    "title": "Prenotazione annullata dal cliente",
                    "content": f"La prenotazione di {client_info.get('name')} per {service_info.get('name')} il {appointment_date} è stata annullata.",
                    "type": "booking_cancelled",
                    "meta_data": json.dumps({
                        "booking_id": booking.id,
                        "date_time": booking.date_time.isoformat()
                    })
                }
                
                async with httpx.AsyncClient() as client:
                    await client.post(f"{NOTIFICATION_SERVICE_URL}/", json=notification_data)
        except Exception as e:
            logger.warning(f"Errore nell'invio della notifica di annullamento: {str(e)}")
    
    async def _send_completion_notifications(self, booking, client_info, professional_info, service_info):
        """Invia notifiche quando una prenotazione viene completata."""
        try:
            # Notifica al cliente per richiedere una recensione
            notification_data = {
                "recipient_id": booking.client_id,
                "title": "Visita completata - Lascia una recensione",
                "content": f"La tua visita con {professional_info.get('name')} è stata completata. Potresti lasciare una recensione?",
                "type": "booking_completed",
                "meta_data": json.dumps({
                    "booking_id": booking.id,
                    "professional_id": booking.professional_id,
                    "request_review": True
                })
            }
            
            async with httpx.AsyncClient() as client:
                await client.post(f"{NOTIFICATION_SERVICE_URL}/", json=notification_data)
        except Exception as e:
            logger.warning(f"Errore nell'invio della notifica di completamento: {str(e)}")

# Funzione factory per creare un'istanza del servizio
def get_integrated_booking_service(db: Session) -> IntegratedBookingService:
    return IntegratedBookingService(db)