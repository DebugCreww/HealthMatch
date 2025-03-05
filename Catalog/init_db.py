"""
Script per l'inizializzazione del database con dati di esempio.
Da eseguire una tantum per popolare il database con dati iniziali.
"""

from src.db.session import SessionLocal, engine
from src.models.service_model import Base, Service, Category, Specialty, Professional
from sqlalchemy.orm import Session

def init_db():
    """Inizializza il database con dati di esempio."""
    # Creazione delle tabelle
    Base.metadata.create_all(bind=engine)
    
    # Creazione della sessione
    db = SessionLocal()
    
    try:
        # Verifica se ci sono già dati nel database
        if db.query(Category).count() > 0:
            print("Il database è già inizializzato. Uscita...")
            return
        
        # Categorie
        categories = [
            Category(name="Visita specialistica", description="Visite con specialisti della salute"),
            Category(name="Esame diagnostico", description="Esami per la diagnosi di patologie"),
            Category(name="Terapia", description="Trattamenti terapeutici"),
            Category(name="Consulenza", description="Consulenze specialistiche"),
            Category(name="Intervento", description="Interventi chirurgici e procedurali")
        ]
        db.add_all(categories)
        db.commit()
        
        # Specialità
        specialties = [
            Specialty(name="Cardiologia", description="Specializzazione in malattie del cuore"),
            Specialty(name="Dermatologia", description="Specializzazione in malattie della pelle"),
            Specialty(name="Ginecologia", description="Specializzazione in salute femminile"),
            Specialty(name="Psicologia", description="Specializzazione in salute mentale"),
            Specialty(name="Ortopedia", description="Specializzazione in sistema muscolo-scheletrico"),
            Specialty(name="Neurologia", description="Specializzazione in sistema nervoso"),
            Specialty(name="Oculistica", description="Specializzazione in vista e occhi"),
            Specialty(name="Otorinolaringoiatria", description="Specializzazione in orecchie, naso e gola")
        ]
        db.add_all(specialties)
        db.commit()
        
        # Professionisti (per test)
        professionals = [
            Professional(id=1, user_id=101, name="Dr. Marco Rossi"),
            Professional(id=2, user_id=102, name="Dr.ssa Giulia Bianchi"),
            Professional(id=3, user_id=103, name="Dr. Antonio Verdi")
        ]
        db.add_all(professionals)
        db.commit()
        
        # Servizi
        # Recuperiamo categorie e specialità
        cat_visita = db.query(Category).filter(Category.name == "Visita specialistica").first()
        cat_esame = db.query(Category).filter(Category.name == "Esame diagnostico").first()
        cat_terapia = db.query(Category).filter(Category.name == "Terapia").first()
        cat_consulenza = db.query(Category).filter(Category.name == "Consulenza").first()
        
        spec_cardio = db.query(Specialty).filter(Specialty.name == "Cardiologia").first()
        spec_dermato = db.query(Specialty).filter(Specialty.name == "Dermatologia").first()
        spec_gineco = db.query(Specialty).filter(Specialty.name == "Ginecologia").first()
        spec_psico = db.query(Specialty).filter(Specialty.name == "Psicologia").first()
        spec_ortopedia = db.query(Specialty).filter(Specialty.name == "Ortopedia").first()
        
        # Creazione servizi
        services = [
            # Servizi cardiologia
            Service(
                name="Visita cardiologica", 
                description="Visita specialistica con cardiologo", 
                duration=30, 
                base_price=120.0,
                categories=[cat_visita],
                specialties=[spec_cardio]
            ),
            Service(
                name="Elettrocardiogramma", 
                description="Registrazione dell'attività elettrica del cuore", 
                duration=15, 
                base_price=50.0,
                categories=[cat_esame],
                specialties=[spec_cardio]
            ),
            
            # Servizi dermatologia
            Service(
                name="Visita dermatologica", 
                description="Visita specialistica con dermatologo", 
                duration=30, 
                base_price=100.0,
                categories=[cat_visita],
                specialties=[spec_dermato]
            ),
            Service(
                name="Crioterapia", 
                description="Trattamento con freddo per lesioni cutanee", 
                duration=20, 
                base_price=70.0,
                categories=[cat_terapia],
                specialties=[spec_dermato]
            ),
            
            # Servizi ginecologia
            Service(
                name="Visita ginecologica", 
                description="Visita specialistica con ginecologo", 
                duration=40, 
                base_price=110.0,
                categories=[cat_visita],
                specialties=[spec_gineco]
            ),
            Service(
                name="Pap test", 
                description="Screening per il cancro cervicale", 
                duration=15, 
                base_price=45.0,
                categories=[cat_esame],
                specialties=[spec_gineco]
            ),
            
            # Servizi psicologia
            Service(
                name="Consulenza psicologica", 
                description="Sessione di consulenza con psicologo", 
                duration=50, 
                base_price=80.0,
                categories=[cat_consulenza],
                specialties=[spec_psico]
            ),
            Service(
                name="Psicoterapia", 
                description="Sessione di terapia psicologica", 
                duration=50, 
                base_price=90.0,
                categories=[cat_terapia],
                specialties=[spec_psico]
            ),
            
            # Servizi ortopedia
            Service(
                name="Visita ortopedica", 
                description="Visita specialistica con ortopedico", 
                duration=30, 
                base_price=110.0,
                categories=[cat_visita],
                specialties=[spec_ortopedia]
            ),
            Service(
                name="Infiltrazione", 
                description="Iniezione terapeutica in articolazione", 
                duration=20, 
                base_price=80.0,
                categories=[cat_terapia],
                specialties=[spec_ortopedia]
            )
        ]
        
        db.add_all(services)
        db.commit()
        
        # Assegnazione servizi ai professionisti
        cardio_services = db.query(Service).join(Service.specialties).filter(Specialty.name == "Cardiologia").all()
        dermato_services = db.query(Service).join(Service.specialties).filter(Specialty.name == "Dermatologia").all()
        psico_services = db.query(Service).join(Service.specialties).filter(Specialty.name == "Psicologia").all()
        
        dr_rossi = db.query(Professional).filter(Professional.id == 1).first()
        dr_bianchi = db.query(Professional).filter(Professional.id == 2).first()
        dr_verdi = db.query(Professional).filter(Professional.id == 3).first()
        
        # Dr. Rossi (cardiologo)
        for service in cardio_services:
            dr_rossi.services.append(service)
            
        # Dr.ssa Bianchi (dermatologa)
        for service in dermato_services:
            dr_bianchi.services.append(service)
            
        # Dr. Verdi (psicologo)
        for service in psico_services:
            dr_verdi.services.append(service)
            
        db.commit()
        
        print("Database inizializzato con successo!")
        print(f"{len(categories)} categorie create")
        print(f"{len(specialties)} specialità create")
        print(f"{len(services)} servizi creati")
        print(f"{len(professionals)} professionisti creati")
        
    except Exception as e:
        print(f"Errore durante l'inizializzazione del database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("Inizializzazione del database...")
    init_db()