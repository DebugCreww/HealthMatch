import os
import sys

# Aggiungi la directory principale al path
sys.path.insert(0, os.path.abspath('.'))

def init_all_databases():
    """Inizializza tutti i database creando le tabelle necessarie"""
    # Crea le directory per i database SQLite
    os.makedirs("Users/data", exist_ok=True)
    os.makedirs("Auth/data", exist_ok=True)
    os.makedirs("Catalog/data", exist_ok=True)
    os.makedirs("Booking/data", exist_ok=True)
    os.makedirs("Notification/data", exist_ok=True)
    
    # Users
    try:
        print("Inizializzazione database Users...")
        from Users.src.db.session import engine
        from Users.src.models.user_model import Base
        Base.metadata.create_all(bind=engine)
        print("✅ Database Users inizializzato")
    except Exception as e:
        print(f"❌ Errore nell'inizializzazione del database Users: {str(e)}")
    
    # Auth
    try:
        print("Inizializzazione database Auth...")
        from Auth.src.db.session import engine
        from Auth.src.models.user_model import Base
        Base.metadata.create_all(bind=engine)
        print("✅ Database Auth inizializzato")
    except Exception as e:
        print(f"❌ Errore nell'inizializzazione del database Auth: {str(e)}")
    
    # Catalog
    try:
        print("Inizializzazione database Catalog...")
        from Catalog.src.db.session import engine
        from Catalog.src.models.service_model import Base
        Base.metadata.create_all(bind=engine)
        print("✅ Database Catalog inizializzato")
    except Exception as e:
        print(f"❌ Errore nell'inizializzazione del database Catalog: {str(e)}")
    
    # Booking
    try:
        print("Inizializzazione database Booking...")
        from Booking.src.db.session import engine
        from Booking.src.models.booking_model import Base
        Base.metadata.create_all(bind=engine)
        print("✅ Database Booking inizializzato")
    except Exception as e:
        print(f"❌ Errore nell'inizializzazione del database Booking: {str(e)}")
    
    # Notification
    try:
        print("Inizializzazione database Notification...")
        from Notification.src.models.notification_model import Base, engine
        Base.metadata.create_all(bind=engine)
        print("✅ Database Notification inizializzato")
    except Exception as e:
        print(f"❌ Errore nell'inizializzazione del database Notification: {str(e)}")

if __name__ == "__main__":
    init_all_databases()
    print("\nTutti i database sono stati inizializzati.")