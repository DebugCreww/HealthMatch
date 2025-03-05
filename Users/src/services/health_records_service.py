# Users/src/services/health_records_service.py
# Implementazione di un servizio per la gestione dei documenti sanitari

import os
import logging
import json
import uuid
from datetime import datetime, timedelta
from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey, Table
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, Session
from typing import List, Dict, Any, Optional
from pydantic import BaseModel

# Configurazione logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Base per i modelli SQLAlchemy
Base = declarative_base()

# Tabella di associazione per le condivisioni
record_sharing = Table(
    'record_sharing',
    Base.metadata,
    Column('record_id', Integer, ForeignKey('health_records.id')),
    Column('professional_id', Integer),
    Column('shared_at', DateTime, default=datetime.utcnow),
    Column('expires_at', DateTime, nullable=True),
    Column('can_edit', Boolean, default=False)
)

# Tabella di associazione per le categorie
record_categories = Table(
    'record_categories',
    Base.metadata,
    Column('record_id', Integer, ForeignKey('health_records.id')),
    Column('category_id', Integer, ForeignKey('health_record_categories.id'))
)

# Definizione del modello per le categorie di documenti sanitari
class HealthRecordCategory(Base):
    __tablename__ = 'health_record_categories'
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    description = Column(String, nullable=True)
    
    # Relazione con i documenti
    records = relationship("HealthRecord", secondary=record_categories, back_populates="categories")

# Definizione del modello per i documenti sanitari
class HealthRecord(Base):
    __tablename__ = 'health_records'
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    record_type = Column(String, nullable=False)  # lab_result, diagnostic, visit, prescription, etc.
    file_path = Column(String, nullable=True)  # percorso del file nel file system
    file_name = Column(String, nullable=True)
    file_type = Column(String, nullable=True)  # mime type
    file_size = Column(Integer, nullable=True)  # dimensione in bytes
    content = Column(Text, nullable=True)  # contenuto testuale del documento, se disponibile
    metadata = Column(Text, nullable=True)  # JSON con metadati aggiuntivi
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_deleted = Column(Boolean, default=False)
    doctor_name = Column(String, nullable=True)
    doctor_id = Column(Integer, nullable=True)  # ID del professionista, se il record è associato a un professionista
    visit_date = Column(DateTime, nullable=True)
    
    # Relazioni
    categories = relationship("HealthRecordCategory", secondary=record_categories, back_populates="records")
    # Aggiungiamo shared_with manualmente nel servizio
    
# Schema Pydantic per la validazione
class HealthRecordCreate(BaseModel):
    user_id: int
    title: str
    description: Optional[str] = None
    record_type: str
    content: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None
    doctor_name: Optional[str] = None
    doctor_id: Optional[int] = None
    visit_date: Optional[datetime] = None
    category_ids: Optional[List[int]] = []

class HealthRecordUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    record_type: Optional[str] = None
    content: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None
    doctor_name: Optional[str] = None
    doctor_id: Optional[int] = None
    visit_date: Optional[datetime] = None
    category_ids: Optional[List[int]] = None

class HealthRecordResponse(BaseModel):
    id: int
    user_id: int
    title: str
    description: Optional[str] = None
    record_type: str
    file_name: Optional[str] = None
    file_type: Optional[str] = None
    file_size: Optional[int] = None
    content: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    doctor_name: Optional[str] = None
    doctor_id: Optional[int] = None
    visit_date: Optional[datetime] = None
    categories: List[str] = []
    shared_with: List[Dict[str, Any]] = []
    
    class Config:
        orm_mode = True

class HealthRecordShareCreate(BaseModel):
    record_id: int
    professional_id: int
    expires_in_days: Optional[int] = 30  # Scadenza condivisione in giorni
    can_edit: Optional[bool] = False

# Implementazione del servizio
class HealthRecordsService:
    def __init__(self, db_session: Session):
        self.db = db_session
        
        # Directory per i file
        self.upload_dir = os.path.join(os.path.abspath(os.getcwd()), "uploads", "health_records")
        os.makedirs(self.upload_dir, exist_ok=True)
    
    async def create_health_record(self, record_data: HealthRecordCreate, file=None) -> HealthRecord:
        """
        Crea un nuovo documento sanitario, opzionalmente con un file allegato.
        """
        try:
            # Inizializzazione record
            new_record = HealthRecord(
                user_id=record_data.user_id,
                title=record_data.title,
                description=record_data.description,
                record_type=record_data.record_type,
                content=record_data.content,
                metadata=json.dumps(record_data.metadata) if record_data.metadata else None,
                doctor_name=record_data.doctor_name,
                doctor_id=record_data.doctor_id,
                visit_date=record_data.visit_date
            )
            
            # Gestione file upload
            if file:
                # Genera nome file univoco
                file_ext = os.path.splitext(file.filename)[1]
                unique_filename = f"{uuid.uuid4()}{file_ext}"
                file_path = os.path.join(self.upload_dir, unique_filename)
                
                # Salva file
                with open(file_path, "wb") as f:
                    f.write(await file.read())
                
                # Aggiorna record con informazioni sul file
                new_record.file_path = file_path
                new_record.file_name = file.filename
                new_record.file_type = file.content_type
                new_record.file_size = os.path.getsize(file_path)
            
            # Aggiungi categorie
            if record_data.category_ids:
                categories = self.db.query(HealthRecordCategory).filter(
                    HealthRecordCategory.id.in_(record_data.category_ids)
                ).all()
                new_record.categories = categories
            
            # Salva nel database
            self.db.add(new_record)
            self.db.commit()
            self.db.refresh(new_record)
            
            return new_record
        except Exception as e:
            self.db.rollback()
            logger.error(f"Errore durante la creazione del documento sanitario: {str(e)}")
            raise
    
    def get_user_health_records(
        self, 
        user_id: int, 
        skip: int = 0, 
        limit: int = 100,
        record_type: Optional[str] = None,
        search: Optional[str] = None,
        category_id: Optional[int] = None,
        include_deleted: bool = False
    ) -> List[HealthRecord]:
        """
        Recupera i documenti sanitari di un utente con vari filtri.
        """
        try:
            query = self.db.query(HealthRecord).filter(HealthRecord.user_id == user_id)
            
            if not include_deleted:
                query = query.filter(HealthRecord.is_deleted == False)
                
            if record_type:
                query = query.filter(HealthRecord.record_type == record_type)
                
            if search:
                query = query.filter(
                    (HealthRecord.title.ilike(f"%{search}%")) |
                    (HealthRecord.description.ilike(f"%{search}%")) |
                    (HealthRecord.doctor_name.ilike(f"%{search}%"))
                )
                
            if category_id:
                query = query.join(HealthRecord.categories).filter(
                    HealthRecordCategory.id == category_id
                )
                
            records = query.order_by(HealthRecord.created_at.desc()).offset(skip).limit(limit).all()
            
            # Arricchimento record con informazioni sulle condivisioni
            for record in records:
                record.shared_with = self._get_record_shares(record.id)
                
            return records
        except Exception as e:
            logger.error(f"Errore durante il recupero dei documenti sanitari: {str(e)}")
            raise
    
    def get_health_record(self, record_id: int, user_id: Optional[int] = None) -> Optional[HealthRecord]:
        """
        Recupera un documento sanitario specifico.
        Se user_id è fornito, verifica che l'utente sia il proprietario o abbia accesso al documento.
        """
        try:
            record = self.db.query(HealthRecord).filter(HealthRecord.id == record_id).first()
            
            if not record:
                return None
                
            # Verifica accesso
            if user_id and record.user_id != user_id:
                # Controlla se l'utente è un professionista con accesso condiviso
                shares = self._get_record_shares(record_id)
                if not any(share["professional_id"] == user_id for share in shares):
                    return None
            
            # Aggiunge informazioni sulle condivisioni
            record.shared_with = self._get_record_shares(record_id)
            
            return record
        except Exception as e:
            logger.error(f"Errore durante il recupero del documento sanitario: {str(e)}")
            raise
    
    def update_health_record(self, record_id: int, record_data: HealthRecordUpdate, user_id: int) -> Optional[HealthRecord]:
        """
        Aggiorna un documento sanitario esistente.
        Verifica che l'utente sia il proprietario o un professionista con permessi di modifica.
        """
        try:
            record = self.db.query(HealthRecord).filter(HealthRecord.id == record_id).first()
            
            if not record:
                return None
                
            # Verifica permessi
            if record.user_id != user_id:
                # Controlla se l'utente è un professionista con accesso in modifica
                shares = self._get_record_shares(record_id)
                professional_share = next((share for share in shares if share["professional_id"] == user_id), None)
                
                if not professional_share or not professional_share.get("can_edit"):
                    raise ValueError("Non hai i permessi per modificare questo documento")
            
            # Aggiorna i campi
            if record_data.title is not None:
                record.title = record_data.title
                
            if record_data.description is not None:
                record.description = record_data.description
                
            if record_data.record_type is not None:
                record.record_type = record_data.record_type
                
            if record_data.content is not None:
                record.content = record_data.content
                
            if record_data.metadata is not None:
                record.metadata = json.dumps(record_data.metadata)
                
            if record_data.doctor_name is not None:
                record.doctor_name = record_data.doctor_name
                
            if record_data.doctor_id is not None:
                record.doctor_id = record_data.doctor_id
                
            if record_data.visit_date is not None:
                record.visit_date = record_data.visit_date
                
            # Aggiorna categorie
            if record_data.category_ids is not None:
                categories = self.db.query(HealthRecordCategory).filter(
                    HealthRecordCategory.id.in_(record_data.category_ids)
                ).all()
                record.categories = categories
            
            # Salva modifiche
            record.updated_at = datetime.utcnow()
            self.db.commit()
            self.db.refresh(record)
            
            # Aggiunge informazioni sulle condivisioni
            record.shared_with = self._get_record_shares(record_id)
            
            return record
        except Exception as e:
            self.db.rollback()
            logger.error(f"Errore durante l'aggiornamento del documento sanitario: {str(e)}")
            raise
    
    def delete_health_record(self, record_id: int, user_id: int, hard_delete: bool = False) -> bool:
        """
        Elimina un documento sanitario.
        Di default esegue una soft delete, impostando is_deleted a True.
        Con hard_delete=True, elimina fisicamente il record e il file associato.
        """
        try:
            record = self.db.query(HealthRecord).filter(HealthRecord.id == record_id).first()
            
            if not record:
                return False
                
            # Verifica permessi
            if record.user_id != user_id:
                raise ValueError("Non hai i permessi per eliminare questo documento")
            
            if hard_delete:
                # Elimina il file dal filesystem se presente
                if record.file_path and os.path.exists(record.file_path):
                    os.remove(record.file_path)
                
                # Elimina il record dal database
                self.db.delete(record)
            else:
                # Soft delete
                record.is_deleted = True
                record.updated_at = datetime.utcnow()
            
            self.db.commit()
            return True
        except Exception as e:
            self.db.rollback()
            logger.error(f"Errore durante l'eliminazione del documento sanitario: {str(e)}")
            raise
    
    def share_health_record(self, share_data: HealthRecordShareCreate, user_id: int) -> Dict[str, Any]:
        """
        Condivide un documento sanitario con un professionista.
        """
        try:
            record = self.db.query(HealthRecord).filter(HealthRecord.id == share_data.record_id).first()
            
            if not record:
                raise ValueError("Documento non trovato")
                
            # Verifica che l'utente sia il proprietario del documento
            if record.user_id != user_id:
                raise ValueError("Non hai i permessi per condividere questo documento")
            
            # Verifica se il professionista esiste (in un'app reale, chiameremmo il servizio utenti)
            # Per ora, assumiamo che esista
            
            # Calcola la scadenza se specificata
            expires_at = None
            if share_data.expires_in_days:
                expires_at = datetime.utcnow() + timedelta(days=share_data.expires_in_days)
            
            # Esegue l'operazione con SQL nativo per la tabella di associazione
            # In una versione più avanzata, si potrebbe creare un modello specifico per le condivisioni
            self.db.execute(
                """
                INSERT INTO record_sharing (record_id, professional_id, shared_at, expires_at, can_edit)
                VALUES (:record_id, :professional_id, :shared_at, :expires_at, :can_edit)
                ON CONFLICT (record_id, professional_id) DO UPDATE
                SET expires_at = :expires_at, can_edit = :can_edit
                """,
                {
                    "record_id": share_data.record_id,
                    "professional_id": share_data.professional_id,
                    "shared_at": datetime.utcnow(),
                    "expires_at": expires_at,
                    "can_edit": share_data.can_edit
                }
            )
            
            self.db.commit()
            
            return {
                "record_id": share_data.record_id,
                "professional_id": share_data.professional_id,
                "expires_at": expires_at,
                "can_edit": share_data.can_edit
            }
        except Exception as e:
            self.db.rollback()
            logger.error(f"Errore durante la condivisione del documento sanitario: {str(e)}")
            raise
    
    def revoke_health_record_share(self, record_id: int, professional_id: int, user_id: int) -> bool:
        """
        Revoca la condivisione di un documento sanitario con un professionista.
        """
        try:
            record = self.db.query(HealthRecord).filter(HealthRecord.id == record_id).first()
            
            if not record:
                raise ValueError("Documento non trovato")
                
            # Verifica che l'utente sia il proprietario del documento
            if record.user_id != user_id:
                raise ValueError("Non hai i permessi per revocare questa condivisione")
            
            # Elimina la condivisione
            self.db.execute(
                """
                DELETE FROM record_sharing
                WHERE record_id = :record_id AND professional_id = :professional_id
                """,
                {"record_id": record_id, "professional_id": professional_id}
            )
            
            self.db.commit()
            return True
        except Exception as e:
            self.db.rollback()
            logger.error(f"Errore durante la revoca della condivisione: {str(e)}")
            raise
    
    def get_shared_records_for_professional(
        self, 
        professional_id: int, 
        skip: int = 0, 
        limit: int = 100,
        include_expired: bool = False
    ) -> List[HealthRecord]:
        """
        Recupera tutti i documenti sanitari condivisi con un professionista.
        """
        try:
            query = """
                SELECT r.* FROM health_records r
                JOIN record_sharing s ON r.id = s.record_id
                WHERE s.professional_id = :professional_id AND r.is_deleted = False
            """
            
            if not include_expired:
                query += " AND (s.expires_at IS NULL OR s.expires_at > :now)"
                
            query += " ORDER BY r.created_at DESC LIMIT :limit OFFSET :skip"
            
            records = self.db.execute(
                query,
                {
                    "professional_id": professional_id,
                    "now": datetime.utcnow(),
                    "limit": limit,
                    "skip": skip
                }
            ).fetchall()
            
            # Converti i risultati in oggetti HealthRecord
            result = []
            for record_data in records:
                record = HealthRecord(**record_data)
                record.shared_with = self._get_record_shares(record.id)
                result.append(record)
                
            return result
        except Exception as e:
            logger.error(f"Errore durante il recupero dei documenti condivisi: {str(e)}")
            raise
    
    def get_record_file(self, record_id: int, user_id: int) -> Optional[Dict[str, Any]]:
        """
        Recupera le informazioni sul file associato a un documento sanitario.
        Verifica che l'utente abbia accesso al documento.
        """
        try:
            record = self.get_health_record(record_id, user_id)
            
            if not record or not record.file_path or not os.path.exists(record.file_path):
                return None
                
            return {
                "file_name": record.file_name,
                "file_path": record.file_path,
                "file_type": record.file_type,
                "file_size": record.file_size
            }
        except Exception as e:
            logger.error(f"Errore durante il recupero del file: {str(e)}")
            raise
    
    def create_category(self, name: str, description: Optional[str] = None) -> HealthRecordCategory:
        """
        Crea una nuova categoria per i documenti sanitari.
        """
        try:
            category = HealthRecordCategory(name=name, description=description)
            self.db.add(category)
            self.db.commit()
            self.db.refresh(category)
            return category
        except Exception as e:
            self.db.rollback()
            logger.error(f"Errore durante la creazione della categoria: {str(e)}")
            raise
    
    def get_categories(self) -> List[HealthRecordCategory]:
        """
        Recupera tutte le categorie disponibili.
        """
        return self.db.query(HealthRecordCategory).order_by(HealthRecordCategory.name).all()
    
    # Metodi privati
    
    def _get_record_shares(self, record_id: int) -> List[Dict[str, Any]]:
        """
        Recupera le informazioni sulle condivisioni di un documento.
        """
        try:
            shares = self.db.execute(
                """
                SELECT professional_id, shared_at, expires_at, can_edit
                FROM record_sharing
                WHERE record_id = :record_id
                """,
                {"record_id": record_id}
            ).fetchall()
            
            result = []
            for share in shares:
                # In un'app reale, qui potremmo arricchire con i dati del professionista
                result.append({
                    "professional_id": share[0],
                    "professional_name": "Professionista",  # Placeholder
                    "shared_at": share[1],
                    "expires_at": share[2],
                    "can_edit": share[3]
                })
                
            return result
        except Exception as e:
            logger.error(f"Errore durante il recupero delle condivisioni: {str(e)}")
            return []

# Funzione factory per creare un'istanza del servizio
def get_health_records_service(db: Session) -> HealthRecordsService:
    return HealthRecordsService(db)