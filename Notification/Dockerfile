FROM python:3.10-slim

# Imposta la directory di lavoro
WORKDIR /app

# Copia il file requirements.txt e installa le dipendenze
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia il codice dell'applicazione
COPY ./src /app/src

# Espone la porta su cui l'applicazione sarà in esecuzione
EXPOSE 8006

# Comando per avviare l'applicazione
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8006"]