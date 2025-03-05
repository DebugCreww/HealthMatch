# Utilizza una base image snella di Python 3.9
FROM python:3.9-slim

# Imposta la working directory all'interno del container
WORKDIR /app

# Copia il file requirements.txt nella working directory
<<<<<<< HEAD
COPY requirements.txt .

# Installa le dipendenze specificate in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
=======
COPY requirements.txt requirements-dev.txt ./

# Installa le dipendenze specificate in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt -r requirements-dev.txt
>>>>>>> ed08febe8056f0ef1780a29730495da7b89e4fb2

# Copia l'intero contenuto del progetto nella working directory
COPY . .

# Documenta la porta su cui l'applicazione ascolterà
EXPOSE 8005

# Comando di avvio: esegue Uvicorn per avviare l'applicazione FastAPI
<<<<<<< HEAD
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8005"]
=======
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8005"]
>>>>>>> ed08febe8056f0ef1780a29730495da7b89e4fb2
