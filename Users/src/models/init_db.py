
# Script di inizializzazione del database per Users
import os
import sys

# Aggiungi la directory principale al path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

# Importa i modelli
from users.src.models import *

# Assicurati che la directory data esista
os.makedirs("./data", exist_ok=True)

# Crea le tabelle
Base.metadata.create_all(bind=engine)

print("Database Users inizializzato con successo")
        