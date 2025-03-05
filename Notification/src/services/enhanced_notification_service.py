# Notification/src/services/enhanced_notification_service.py
# Implementazione di un servizio di notifica avanzato con supporto per vari canali

import logging
import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from jinja2 import Template
from src.models.notification_model import Notification

# Configurazione logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class EnhancedNotificationService:
    def __init__(self, db_session: Session):
        self.db = db_session
        
        # Configurazioni per i vari canali di notifica
        self.email_config = {
            "smtp_server": os.getenv("SMTP_SERVER", "smtp.example.com"),
            "smtp_port": int(os.getenv("SMTP_PORT", "587")),
            "smtp_user": os.getenv("SMTP_USER", "user@example.com"),
            "smtp_password": os.getenv("SMTP_PASSWORD", "password"),
            "from_email": os.getenv("FROM_EMAIL", "no-reply@healthmatch.example.com"),
            "from_name": os.getenv("FROM_NAME", "HealthMatch")
        }
        
        self.sms_config = {
            "api_key": os.getenv("SMS_API_KEY", "your_api_key"),
            "api_secret": os.getenv("SMS_API_SECRET", "your_api_secret"),
            "from_number": os.getenv("SMS_FROM_NUMBER", "+1234567890")
        }
        
        self.push_config = {
            "api_key": os.getenv("PUSH_API_KEY", "your_api_key"),
            "project_id": os.getenv("PUSH_PROJECT_ID", "your_project_id")
        }
        
        # Templates per email
        self.email_templates = {
            "booking_confirmation": """
                <h2>Prenotazione confermata</h2>
                <p>Gentile {{user_name}},</p>
                <p>La tua prenotazione con {{professional_name}} per {{service_name}} il {{appointment_date}} è stata confermata.</p>
                <p>Dettagli dell'appuntamento:</p>
                <ul>
                    <li><strong>Data e ora:</strong> {{appointment_date}}</li>
                    <li><strong>Luogo:</strong> {{location}}</li>
                    <li><strong>Servizio:</strong> {{service_name}}</li>
                    <li><strong>Professionista:</strong> {{professional_name}}</li>
                </ul>
                <p>Per cancellare o riprogrammare la tua prenotazione, accedi alla piattaforma HealthMatch.</p>
                <p>Cordiali saluti,<br>Il team di HealthMatch</p>
            """,
            "appointment_reminder": """
                <h2>Promemoria appuntamento</h2>
                <p>Gentile {{user_name}},</p>
                <p>Ti ricordiamo che hai un appuntamento con {{professional_name}} domani, {{appointment_date}}.</p>
                <p>Dettagli dell'appuntamento:</p>
                <ul>
                    <li><strong>Data e ora:</strong> {{appointment_date}}</li>
                    <li><strong>Luogo:</strong> {{location}}</li>
                    <li><strong>Servizio:</strong> {{service_name}}</li>
                </ul>
                <p>Cordiali saluti,<br>Il team di HealthMatch</p>
            """,
            "document_shared": """
                <h2>Documento condiviso</h2>
                <p>Gentile {{professional_name}},</p>
                <p>Un paziente ha condiviso un nuovo documento sanitario con te.</p>
                <p>Dettagli del documento:</p>
                <ul>
                    <li><strong>Titolo:</strong> {{document_title}}</li>
                    <li><strong>Paziente:</strong> {{user_name}}</li>
                    <li><strong>Tipo:</strong> {{document_type}}</li>
                </ul>
                <p>Puoi visualizzare il documento accedendo alla piattaforma HealthMatch.</p>
                <p>Cordiali saluti,<br>Il team di HealthMatch</p>
            """,
            "payment_confirmation": """
                <h2>Pagamento confermato</h2>
                <p>Gentile {{user_name}},</p>
                <p>Il tuo pagamento di {{amount}} € per {{service_name}} è stato confermato.</p>
                <p>Dettagli del pagamento:</p>
                <ul>
                    <li><strong>Importo:</strong> {{amount}} €</li>
                    <li><strong>Data:</strong> {{payment_date}}</li>
                    <li><strong>Metodo:</strong> {{payment_method}}</li>
                    <li><strong>Riferimento:</strong> {{payment_reference}}</li>
                </ul>
                <p>La fattura è disponibile nella tua area personale.</p>
                <p>Cordiali saluti,<br>Il team di HealthMatch</p>
            """,
            "new_message": """
                <h2>Nuovo messaggio</h2>
                <p>Gentile {{recipient_name}},</p>
                <p>Hai ricevuto un nuovo messaggio da {{sender_name}}:</p>
                <blockquote>"{{message_preview}}"</blockquote>
                <p>Accedi alla piattaforma per visualizzare il messaggio completo e rispondere.</p>
                <p>Cordiali saluti,<br>Il team di HealthMatch</p>
            """
        }
        
        # Templates per SMS
        self.sms_templates = {
            "booking_confirmation": "HealthMatch: Prenotazione confermata con {{professional_name}} per il {{appointment_date}}.",
            "appointment_reminder": "HealthMatch: Promemoria - hai un appuntamento con {{professional_name}} domani alle {{appointment_time}}.",
            "payment_confirmation": "HealthMatch: Pagamento di {{amount}} € confermato per {{service_name}}.",
            "new_message": "HealthMatch: Nuovo messaggio da {{sender_name}}. Accedi alla piattaforma per visualizzarlo."
        }
    
    async def send_notification(self, notification_data: Dict[str, Any]) -> Notification:
        """
        Invia una notifica attraverso vari canali (piattaforma, email, SMS) in base
        alle preferenze dell'utente.
        """
        try:
            # 0. Recuperiamo le preferenze dell'utente dal servizio utenti
            user_preferences = await self._get_user_notification_preferences(notification_data["recipient_id"])
            
            # 1. Salva la notifica nel database (sempre)
            notification = self._create_notification_record(notification_data)
            
            # 2. Invia notifiche aggiuntive in base alle preferenze dell'utente
            if user_preferences.get("email_enabled", False):
                await self._send_email_notification(notification_data, user_preferences.get("email"))
                
            if user_preferences.get("sms_enabled", False):
                await self._send_sms_notification(notification_data, user_preferences.get("phone"))
                
            if user_preferences.get("push_enabled", False):
                await self._send_push_notification(notification_data, user_preferences.get("device_tokens", []))
            
            return notification
        except Exception as e:
            logger.error(f"Errore durante l'invio della notifica: {str(e)}")
            # In caso di errore, tenta comunque di creare la notifica nel database
            # per garantire che almeno la notifica in-app sia disponibile
            return self._create_notification_record(notification_data)
    
    async def send_batch_notifications(self, notification_data_list: List[Dict[str, Any]]) -> List[Notification]:
        """
        Invia notifiche in batch a più destinatari.
        Utile per notifiche di sistema o annunci.
        """
        results = []
        
        for notification_data in notification_data_list:
            try:
                result = await self.send_notification(notification_data)
                results.append(result)
            except Exception as e:
                logger.error(f"Errore durante l'invio della notifica in batch: {str(e)}")
                # Continua con le altre notifiche anche in caso di errore
        
        return results
    
    async def schedule_notification(self, notification_data: Dict[str, Any], schedule_time: datetime) -> Dict[str, Any]:
        """
        Programma una notifica da inviare in futuro.
        In una implementazione reale, utilizzeremmo un sistema come Celery o un servizio di scheduling.
        """
        try:
            # In un'implementazione reale, qui registreremmo il task nel sistema di scheduling
            # Per ora, creiamo solo un record nel database con uno stato 'scheduled'
            
            # Aggiungiamo informazioni sulla programmazione
            notification_data["scheduled_for"] = schedule_time.isoformat()
            notification_data["status"] = "scheduled"
            
            # Creiamo un record per la notifica programmata
            notification = Notification(
                recipient_id=notification_data["recipient_id"],
                sender_id=notification_data.get("sender_id"),
                title=notification_data["title"],
                content=notification_data["content"],
                type=notification_data["type"],
                meta_data=json.dumps(notification_data.get("meta_data", {})),
                is_read=False,
                scheduled_for=schedule_time
            )
            
            self.db.add(notification)
            self.db.commit()
            self.db.refresh(notification)
            
            return {
                "status": "scheduled",
                "notification_id": notification.id,
                "scheduled_for": schedule_time.isoformat()
            }
        except Exception as e:
            self.db.rollback()
            logger.error(f"Errore durante la programmazione della notifica: {str(e)}")
            raise
    
    def get_user_notifications(
        self, 
        user_id: int, 
        skip: int = 0, 
        limit: int = 20,
        unread_only: bool = False,
        notification_type: Optional[str] = None
    ) -> List[Notification]:
        """
        Recupera le notifiche di un utente con vari filtri.
        """
        try:
            query = self.db.query(Notification).filter(
                Notification.recipient_id == user_id,
                Notification.scheduled_for == None  # Esclude notifiche programmate per il futuro
            )
            
            if unread_only:
                query = query.filter(Notification.is_read == False)
                
            if notification_type:
                query = query.filter(Notification.type == notification_type)
                
            return query.order_by(Notification.created_at.desc()).offset(skip).limit(limit).all()
        except Exception as e:
            logger.error(f"Errore durante il recupero delle notifiche: {str(e)}")
            raise
    
    def mark_notification_as_read(self, notification_id: int, user_id: int) -> bool:
        """
        Segna una notifica come letta.
        """
        try:
            notification = self.db.query(Notification).filter(
                Notification.id == notification_id,
                Notification.recipient_id == user_id
            ).first()
            
            if not notification:
                return False
                
            notification.is_read = True
            notification.read_at = datetime.utcnow()
            
            self.db.commit()
            return True
        except Exception as e:
            self.db.rollback()
            logger.error(f"Errore durante l'aggiornamento della notifica: {str(e)}")
            raise
    
    def mark_all_as_read(self, user_id: int) -> int:
        """
        Segna tutte le notifiche di un utente come lette.
        Restituisce il numero di notifiche aggiornate.
        """
        try:
            now = datetime.utcnow()
            result = self.db.query(Notification).filter(
                Notification.recipient_id == user_id,
                Notification.is_read == False
            ).update({
                "is_read": True,
                "read_at": now
            })
            
            self.db.commit()
            return result
        except Exception as e:
            self.db.rollback()
            logger.error(f"Errore durante l'aggiornamento delle notifiche: {str(e)}")
            raise
    
    def delete_notification(self, notification_id: int, user_id: int) -> bool:
        """
        Elimina una notifica.
        """
        try:
            notification = self.db.query(Notification).filter(
                Notification.id == notification_id,
                Notification.recipient_id == user_id
            ).first()
            
            if not notification:
                return False
                
            self.db.delete(notification)
            self.db.commit()
            return True
        except Exception as e:
            self.db.rollback()
            logger.error(f"Errore durante l'eliminazione della notifica: {str(e)}")
            raise
    
    def get_unread_count(self, user_id: int) -> int:
        """
        Conta le notifiche non lette di un utente.
        """
        try:
            return self.db.query(Notification).filter(
                Notification.recipient_id == user_id,
                Notification.is_read == False,
                Notification.scheduled_for == None  # Esclude notifiche programmate per il futuro
            ).count()
        except Exception as e:
            logger.error(f"Errore durante il conteggio delle notifiche: {str(e)}")
            raise
    
    # Metodi privati
    
    def _create_notification_record(self, notification_data: Dict[str, Any]) -> Notification:
        """
        Crea un record nel database per una notifica.
        """
        try:
            notification = Notification(
                recipient_id=notification_data["recipient_id"],
                sender_id=notification_data.get("sender_id"),
                title=notification_data["title"],
                content=notification_data["content"],
                type=notification_data["type"],
                meta_data=json.dumps(notification_data.get("meta_data", {})),
                is_read=False
            )
            
            self.db.add(notification)
            self.db.commit()
            self.db.refresh(notification)
            
            return notification
        except Exception as e:
            self.db.rollback()
            logger.error(f"Errore durante la creazione della notifica: {str(e)}")
            raise
    
    async def _get_user_notification_preferences(self, user_id: int) -> Dict[str, Any]:
        """
        Recupera le preferenze di notifica di un utente dal servizio utenti.
        In un'app reale, chiameresti l'API del servizio utenti.
        """
        try:
            # Implementazione segnaposto che ritorna preferenze predefinite
            # In un'app reale, qui chiameremmo il servizio utenti
            
            # Mock dei dati
            mock_preferences = {
                "email_enabled": True,
                "email": f"user{user_id}@example.com",
                "sms_enabled": False,
                "phone": "+123456789",
                "push_enabled": True,
                "device_tokens": ["device_token_1", "device_token_2"]
            }
            
            return mock_preferences
        except Exception as e:
            logger.warning(f"Errore durante il recupero delle preferenze utente: {str(e)}")
            # In caso di errore, ritorna preferenze di default che abilitano solo le notifiche in-app
            return {
                "email_enabled": False,
                "sms_enabled": False,
                "push_enabled": False
            }
    
    async def _send_email_notification(self, notification_data: Dict[str, Any], recipient_email: str) -> bool:
        """
        Invia una notifica via email.
        """
        try:
            # Determinazione del template da utilizzare
            template_key = notification_data.get("type", "default")
            template_html = self.email_templates.get(template_key)
            
            if not template_html:
                # Se non esiste un template specifico, utilizziamo un formato generico
                template_html = """
                    <h2>{{title}}</h2>
                    <p>{{content}}</p>
                    <p>Cordiali saluti,<br>Il team di HealthMatch</p>
                """
            
            # Preparazione del contesto per il template
            template_context = {
                "title": notification_data.get("title", "Notifica"),
                "content": notification_data.get("content", ""),
                **notification_data.get("meta_data", {})
            }
            
            # Rendering del template
            template = Template(template_html)
            html_content = template.render(**template_context)
            
            # Creazione del messaggio
            message = MIMEMultipart("alternative")
            message["Subject"] = notification_data.get("title", "Notifica da HealthMatch")
            message["From"] = f"{self.email_config['from_name']} <{self.email_config['from_email']}>"
            message["To"] = recipient_email
            
            # Aggiungiamo sia una versione testuale che HTML
            text_content = notification_data.get("content", "")
            message.attach(MIMEText(text_content, "plain"))
            message.attach(MIMEText(html_content, "html"))
            
            # Invio dell'email
            # In un'app reale, qui utilizzeremmo un servizio di email come SendGrid, Mailgun, etc.
            # o un server SMTP
            
            # Per ora, solo loghiamo il messaggio
            logger.info(f"Email inviata a {recipient_email}: {notification_data.get('title')}")
            
            # Simuliamo l'invio (commentare in produzione)
            """
            with smtplib.SMTP(self.email_config["smtp_server"], self.email_config["smtp_port"]) as server:
                server.starttls()
                server.login(self.email_config["smtp_user"], self.email_config["smtp_password"])
                server.send_message(message)
            """
            
            return True
        except Exception as e:
            logger.error(f"Errore durante l'invio dell'email: {str(e)}")
            return False
    
    async def _send_sms_notification(self, notification_data: Dict[str, Any], phone_number: str) -> bool:
        """
        Invia una notifica via SMS.
        """
        try:
            # Determinazione del template da utilizzare
            template_key = notification_data.get("type", "default")
            template_text = self.sms_templates.get(template_key)
            
            if not template_text:
                # Se non esiste un template specifico, utilizziamo un formato generico
                template_text = "HealthMatch: {{title}} - {{content}}"
            
            # Preparazione del contesto per il template
            template_context = {
                "title": notification_data.get("title", "Notifica"),
                "content": notification_data.get("content", ""),
                **notification_data.get("meta_data", {})
            }
            
            # Rendering del template
            template = Template(template_text)
            sms_content = template.render(**template_context)
            
            # Tronchiamo il messaggio a 160 caratteri per SMS standard
            if len(sms_content) > 160:
                sms_content = sms_content[:157] + "..."
            
            # Invio dell'SMS
            # In un'app reale, qui utilizzeremmo un servizio di SMS come Twilio, Nexmo, etc.
            
            # Per ora, solo loghiamo il messaggio
            logger.info(f"SMS inviato a {phone_number}: {sms_content}")
            
            return True
        except Exception as e:
            logger.error(f"Errore durante l'invio dell'SMS: {str(e)}")
            return False
    
    async def _send_push_notification(self, notification_data: Dict[str, Any], device_tokens: List[str]) -> bool:
        """
        Invia una notifica push.
        """
        try:
            if not device_tokens:
                return False
                
            # Preparazione del payload della notifica push
            push_payload = {
                "notification": {
                    "title": notification_data.get("title", "Notifica"),
                    "body": notification_data.get("content", ""),
                    "icon": "notification_icon",
                    "click_action": "OPEN_APP"
                },
                "data": {
                    "type": notification_data.get("type", "default"),
                    **notification_data.get("meta_data", {})
                }
            }
            
            # Invio della notifica push
            # In un'app reale, qui utilizzeremmo un servizio di push notifications come 
            # Firebase Cloud Messaging, OneSignal, etc.
            
            # Per ora, solo loghiamo il messaggio
            logger.info(f"Push inviata a {len(device_tokens)} dispositivi: {notification_data.get('title')}")
            
            return True
        except Exception as e:
            logger.error(f"Errore durante l'invio della notifica push: {str(e)}")
            return False

# Funzione factory per creare un'istanza del servizio
def get_enhanced_notification_service(db: Session):
    return EnhancedNotificationService(db)