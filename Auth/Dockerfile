# Utilizza una base image snella di Python 3.9
FROM python:3.9-slim

# Imposta la working directory all'interno del container
WORKDIR /app

# Copia il file requirements.txt nella working directory
COPY requirements.txt .

# Installa le dipendenze specificate in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copia l'intero contenuto del progetto nella working directory
COPY . .

# Documenta la porta su cui l'applicazione ascolterà
EXPOSE 8001

# Comando di avvio: esegue Uvicorn per avviare l'applicazione FastAPI
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8001"]
