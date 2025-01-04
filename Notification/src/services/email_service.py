import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

def send_email(recipient: str, subject: str, body: str):
    """
    Invio di una notifica via email.
    """
    try:
        message = Mail(
            from_email=os.getenv("EMAIL_SENDER"),  # Configura il mittente come variabile d'ambiente
            to_emails=recipient,
            subject=subject,
            html_content=body
        )
        sg = SendGridAPIClient(os.getenv("SENDGRID_API_KEY"))  # Configura la chiave API
        response = sg.send(message)
        return {"status": "success", "response_code": response.status_code}
    except Exception as e:
        return {"status": "error", "error": str(e)}
