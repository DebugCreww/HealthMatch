from sqlalchemy import Column, Integer, String, create_engine
from sqlalchemy.ext.declarative import declarative_base

# Creazione della base dichiarativa per SQLAlchemy
Base = declarative_base()

# Definizione del modello User
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password = Column(String)

# Esempio di configurazione della connessione al database
engine = create_engine("sqlite:///auth.db")
Base.metadata.create_all(bind=engine)
