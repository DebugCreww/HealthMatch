# Users/src/controllers/health_records_controller.py
# Controller per la gestione dei documenti sanitari

from fastapi import APIRouter, HTTPException, Depends, File, UploadFile, Form, Query, Path, Body
from sqlalchemy.orm import Session
from typing import List, Optional
import json

from src.db.session import get_db
from src.services.health_records_service import (
    get_health_records_service,
    HealthRecordsService,
    HealthRecordCreate,
    HealthRecordUpdate,
    HealthRecordResponse,
    HealthRecordShareCreate
)
from src.middleware.auth_middleware import get_current_user

router = APIRouter()

@router.post("/", response_model=HealthRecordResponse)
async def create_health_record(
    title: str = Form(...),
    record_type: str = Form(...),
    description: Optional[str] = Form(None),
    doctor_name: Optional[str] = Form(None),
    doctor_id: Optional[int] = Form(None),
    visit_date: Optional[str] = Form(None),
    metadata: Optional[str] = Form(None),
    category_ids: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Crea un nuovo documento sanitario, con possibilità di allegare un file.
    """
    user_id = int(current_user.get("sub"))
    
    # Parsing dei dati dal form
    record_data = HealthRecordCreate(
        user_id=user_id,
        title=title,
        description=description,
        record_type=record_type,
        doctor_name=doctor_name,
        doctor_id=doctor_id,
        visit_date=None,  # Questo verrà convertito nel formato corretto
        metadata=json.loads(metadata) if metadata else None,
        category_ids=json.loads(category_ids) if category_ids else []
    )
    
    # Parsing della data se presente
    if visit_date:
        from datetime import datetime
        try:
            record_data.visit_date = datetime.fromisoformat(visit_date)
        except ValueError:
            pass
    
    service = get_health_records_service(db)
    
    try:
        result = await service.create_health_record(record_data, file)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Errore durante la creazione del documento: {str(e)}")

@router.get("/user/{user_id}", response_model=List[HealthRecordResponse])
async def get_user_health_records(
    user_id: int = Path(...),
    skip: int = Query(0),
    limit: int = Query(100),
    record_type: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    category_id: Optional[int] = Query(None),
    include_deleted: bool = Query(False),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Recupera i documenti sanitari di un utente.
    L'utente deve essere il proprietario o un professionista con accesso ai documenti.
    """
    logged_user_id = int(current_user.get("sub"))
    user_role = current_user.get("role")
    
    # Verifica autorizzazione
    if str(user_id) != str(logged_user_id) and user_role != "admin" and user_role != "professional":
        raise HTTPException(
            status_code=403,
            detail="Non sei autorizzato a visualizzare i documenti di questo utente"
        )
    
    service = get_health_records_service(db)
    
    try:
        if user_role == "professional" and str(user_id) != str(logged_user_id):
            # Se è un professionista che sta cercando di accedere ai documenti di un altro utente,
            # restituisci solo i documenti condivisi con lui
            records = service.get_shared_records_for_professional(
                professional_id=logged_user_id,
                skip=skip,
                limit=limit
            )
            # Filtra ulteriormente in base ai parametri
            if record_type:
                records = [r for r in records if r.record_type == record_type]
            if search:
                records = [r for r in records if search.lower() in r.title.lower() or 
                          (r.description and search.lower() in r.description.lower())]
            if category_id:
                records = [r for r in records if any(c.id == category_id for c in r.categories)]
        else:
            # Se l'utente sta accedendo ai propri documenti o è un admin
            records = service.get_user_health_records(
                user_id=user_id,
                skip=skip,
                limit=limit,
                record_type=record_type,
                search=search,
                category_id=category_id,
                include_deleted=include_deleted if user_role == "admin" else False
            )
        
        return records
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Errore durante il recupero dei documenti: {str(e)}"
        )

@router.get("/{record_id}", response_model=HealthRecordResponse)
async def get_health_record(
    record_id: int = Path(...),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Recupera un documento sanitario specifico.
    L'utente deve essere il proprietario o un professionista con accesso al documento.
    """
    user_id = int(current_user.get("sub"))
    
    service = get_health_records_service(db)
    
    try:
        record = service.get_health_record(record_id, user_id)
        
        if not record:
            raise HTTPException(
                status_code=404,
                detail="Documento non trovato o accesso negato"
            )
        
        return record
    except Exception as e:
        if "accesso negato" in str(e).lower():
            raise HTTPException(status_code=403, detail=str(e))
        raise HTTPException(status_code=400, detail=f"Errore durante il recupero del documento: {str(e)}")

@router.put("/{record_id}", response_model=HealthRecordResponse)
async def update_health_record(
    record_id: int = Path(...),
    record_data: HealthRecordUpdate = Body(...),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Aggiorna un documento sanitario esistente.
    L'utente deve essere il proprietario o un professionista con permessi di modifica.
    """
    user_id = int(current_user.get("sub"))
    
    service = get_health_records_service(db)
    
    try:
        record = service.update_health_record(record_id, record_data, user_id)
        
        if not record:
            raise HTTPException(
                status_code=404,
                detail="Documento non trovato o accesso negato"
            )
        
        return record
    except ValueError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Errore durante l'aggiornamento del documento: {str(e)}")

@router.delete("/{record_id}")
async def delete_health_record(
    record_id: int = Path(...),
    hard_delete: bool = Query(False),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Elimina un documento sanitario.
    Solo il proprietario può eliminare un documento.
    """
    user_id = int(current_user.get("sub"))
    user_role = current_user.get("role")
    
    # Solo gli admin possono fare hard delete
    if hard_delete and user_role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Solo gli amministratori possono eseguire eliminazioni permanenti"
        )
    
    service = get_health_records_service(db)
    
    try:
        result = service.delete_health_record(record_id, user_id, hard_delete)
        
        if not result:
            raise HTTPException(
                status_code=404,
                detail="Documento non trovato"
            )
        
        return {"message": "Documento eliminato con successo"}
    except ValueError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Errore durante l'eliminazione del documento: {str(e)}")

@router.post("/{record_id}/share")
async def share_health_record(
    record_id: int = Path(...),
    share_data: HealthRecordShareCreate = Body(...),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Condivide un documento sanitario con un professionista.
    Solo il proprietario può condividere un documento.
    """
    user_id = int(current_user.get("sub"))
    
    # Assicuriamoci che l'ID del record nel path e nel body corrispondano
    if share_data.record_id != record_id:
        share_data.record_id = record_id
    
    service = get_health_records_service(db)
    
    try:
        result = service.share_health_record(share_data, user_id)
        return {"message": "Documento condiviso con successo", **result}
    except ValueError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Errore durante la condivisione del documento: {str(e)}")

@router.delete("/{record_id}/share/{professional_id}")
async def revoke_health_record_share(
    record_id: int = Path(...),
    professional_id: int = Path(...),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Revoca la condivisione di un documento sanitario con un professionista.
    Solo il proprietario può revocare una condivisione.
    """
    user_id = int(current_user.get("sub"))
    
    service = get_health_records_service(db)
    
    try:
        result = service.revoke_health_record_share(record_id, professional_id, user_id)
        
        if not result:
            raise HTTPException(
                status_code=404,
                detail="Condivisione non trovata"
            )
        
        return {"message": "Condivisione revocata con successo"}
    except ValueError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Errore durante la revoca della condivisione: {str(e)}")

@router.get("/{record_id}/file")
async def download_health_record_file(
    record_id: int = Path(...),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Recupera il file associato a un documento sanitario.
    L'utente deve essere il proprietario o un professionista con accesso al documento.
    """
    from fastapi.responses import FileResponse
    
    user_id = int(current_user.get("sub"))
    
    service = get_health_records_service(db)
    
    try:
        file_info = service.get_record_file(record_id, user_id)
        
        if not file_info:
            raise HTTPException(
                status_code=404,
                detail="File non trovato o accesso negato"
            )
        
        return FileResponse(
            path=file_info["file_path"],
            filename=file_info["file_name"],
            media_type=file_info["file_type"]
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Errore durante il recupero del file: {str(e)}")

@router.get("/shared/professional", response_model=List[HealthRecordResponse])
async def get_shared_records_for_professional(
    skip: int = Query(0),
    limit: int = Query(100),
    include_expired: bool = Query(False),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Recupera tutti i documenti sanitari condivisi con il professionista autenticato.
    """
    user_id = int(current_user.get("sub"))
    user_role = current_user.get("role")
    
    # Verifica che l'utente sia un professionista
    if user_role != "professional":
        raise HTTPException(
            status_code=403,
            detail="Solo i professionisti possono accedere ai documenti condivisi"
        )
    
    service = get_health_records_service(db)
    
    try:
        records = service.get_shared_records_for_professional(
            professional_id=user_id,
            skip=skip,
            limit=limit,
            include_expired=include_expired
        )
        
        return records
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Errore durante il recupero dei documenti condivisi: {str(e)}"
        )

@router.get("/categories/all")
async def get_categories(
    db: Session = Depends(get_db)
):
    """
    Recupera tutte le categorie disponibili per i documenti sanitari.
    """
    service = get_health_records_service(db)
    
    try:
        categories = service.get_categories()
        return [{"id": c.id, "name": c.name, "description": c.description} for c in categories]
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Errore durante il recupero delle categorie: {str(e)}")

@router.post("/categories")
async def create_category(
    name: str = Body(...),
    description: Optional[str] = Body(None),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Crea una nuova categoria per i documenti sanitari.
    Solo gli amministratori possono creare categorie.
    """
    user_role = current_user.get("role")
    
    if user_role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Solo gli amministratori possono creare categorie"
        )
    
    service = get_health_records_service(db)
    
    try:
        category = service.create_category(name, description)
        return {"id": category.id, "name": category.name, "description": category.description}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Errore durante la creazione della categoria: {str(e)}")