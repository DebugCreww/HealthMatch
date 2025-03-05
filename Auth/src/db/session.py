from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import os

# Percorso assoluto per il database
base_dir = os.path.abspath(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
data_dir = os.path.join(base_dir, "data")
os.makedirs(data_dir, exist_ok=True)
db_path = os.path.join(data_dir, "auth.db")  # CORRETTO: nome specifico per questo servizio

# URL del database
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{db_path}")

# Creazione del motore di connessione al database
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
# Creazione della sessione del database
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
# Creazione della base per la dichiarazione delle tabelle
Base = declarative_base()

# Funzione per ottenere una sessione del database
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()