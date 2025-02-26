# HealthMatch

HealthMatch è una piattaforma progettata per mettere in contatto clienti con professionisti del benessere, facilitando la prenotazione di servizi personalizzati.

## Requisiti

Assicurati di avere installato sul tuo sistema:

- **Docker**: per l'esecuzione dei container.
- **Docker Compose**: per orchestrare i vari servizi.

## Struttura del Progetto

Il progetto è composto da diversi microservizi, ciascuno con responsabilità specifiche:

- **Auth Service**: Gestione dell'autenticazione e autorizzazione.
- **User Management Service**: Gestione dei profili utente.
- **Service Catalog Service**: Gestione del catalogo dei servizi offerti.
- **Booking Service**: Gestione delle prenotazioni tra clienti e professionisti.
- **Payment Service**: Gestione dei pagamenti per i servizi prenotati.
- **Notification Service**: Gestione delle notifiche verso gli utenti.
- **API Gateway**: Punto di ingresso unificato per tutti i servizi.
- **Frontend**: Interfaccia utente sviluppata in React.

## Configurazione e Installazione

### 1. Clona il Repository

```bash
git clone https://github.com/DebugCreww/HealthMatch.git
cd HealthMatch
