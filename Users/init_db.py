"""
Script per l'inizializzazione del database con dati di esempio.
Da eseguire una tantum per popolare il database con dati iniziali.
"""

from src.db.session import SessionLocal, engine
from src.models.user_model import Base, User, Specialty
from sqlalchemy.orm import Session

def init_db():
    """Inizializza il database con dati di esempio."""
    # Creazione delle tabelle
    Base.metadata.create_all(bind=engine)
    
    # Creazione della sessione
    db = SessionLocal()
    
    try:
        # Verifica se ci sono già dati nel database
        if db.query(User).count() > 0:
            print("Il database è già inizializzato. Uscita...")
            return
        
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
        
        # Utenti (clienti)
        clients = [
            User(
                email="mario.rossi@example.com",
                name="Mario",
                surname="Rossi",
                user_type="client",
                gender="M",
                birth_date="1985-06-12",
                phone="+39 333 1234567",
                city="Milano"
            ),
            User(
                email="laura.bianchi@example.com",
                name="Laura",
                surname="Bianchi",
                user_type="client",
                gender="F",
                birth_date="1990-03-25",
                phone="+39 333 7654321",
                city="Roma"
            ),
            User(
                email="giuseppe.verdi@example.com",
                name="Giuseppe",
                surname="Verdi",
                user_type="client",
                gender="M",
                birth_date="1978-11-18",
                phone="+39 333 9876543",
                city="Napoli"
            )
        ]
        db.add_all(clients)
        db.commit()
        
        # Professionisti
        cardiology = db.query(Specialty).filter(Specialty.name == "Cardiologia").first()
        dermatology = db.query(Specialty).filter(Specialty.name == "Dermatologia").first()
        psychology = db.query(Specialty).filter(Specialty.name == "Psicologia").first()
        
        professionals = [
            User(
                email="marco.rossi@example.com",
                name="Dr. Marco",
                surname="Rossi",
                user_type="professional",
                gender="M",
                birth_date="1975-04-10",
                phone="+39 333 1111111",
                city="Milano",
                bio="Cardiologo con 15 anni di esperienza clinica e di ricerca.",
                experience_years=15,
                rating=4.9,
                review_count=42
            ),
            User(
                email="giulia.bianchi@example.com",
                name="Dr.ssa Giulia",
                surname="Bianchi",
                user_type="professional",
                gender="F",
                birth_date="1982-08-22",
                phone="+39 333 2222222",
                city="Roma",
                bio="Dermatologa specializzata in dermatologia estetica e patologie cutanee.",
                experience_years=10,
                rating=4.8,
                review_count=36
            ),
            User(
                email="antonio.verdi@example.com",
                name="Dr. Antonio",
                surname="Verdi",
                user_type="professional",
                gender="M",
                birth_date="1980-12-05",
                phone="+39 333 3333333",
                city="Milano",
                bio="Psicologo clinico specializzato in terapia cognitivo-comportamentale.",
                experience_years=12,
                rating=4.7,
                review_count=28
            )
        ]
        
        # Aggiungi specialità ai professionisti
        professionals[0].specialties.append(cardiology)
        professionals[1].specialties.append(dermatology)
        professionals[2].specialties.append(psychology)
        
        db.add_all(professionals)
        db.commit()
        
        print("Database inizializzato con successo!")
        print(f"{len(specialties)} specialità create")
        print(f"{len(clients)} clienti creati")
        print(f"{len(professionals)} professionisti creati")
        
    except Exception as e:
        print(f"Errore durante l'inizializzazione del database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("Inizializzazione del database...")
    init_db()