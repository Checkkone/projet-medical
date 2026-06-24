import asyncio
import json
import aio_pika
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

load_dotenv()

RABBITMQ_URL = os.getenv("RABBITMQ_URL", "amqp://admin:secret123@localhost:5672")
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")

def send_email(to_email: str, subject: str, body: str):
    """Envoyer un email via SMTP"""
    try:
        msg = MIMEMultipart()
        msg['From'] = SMTP_USER
        msg['To'] = to_email
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'plain'))

        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.send_message(msg)

        print(f"✅ Email envoyé à {to_email}")
    except Exception as e:
        print(f"❌ Erreur envoi email: {e}")

async def process_rdv_created(message: aio_pika.IncomingMessage):
    """Traiter un message de création de RDV"""
    async with message.process():
        data = json.loads(message.body)
        print(f"📨 Nouveau RDV reçu: {data}")

        # Envoyer email de confirmation
        send_email(
            to_email=SMTP_USER,  # En prod, ce serait l'email du patient
            subject="Confirmation de votre rendez-vous médical",
            body=f"""
Bonjour,

Votre rendez-vous médical a été confirmé.

Détails :
- Date : {data.get('date_rdv')}
- Heure : {data.get('heure_rdv')}
- Médecin ID : {data.get('medecin_id')}

Merci de votre confiance.

L'équipe Médicale
            """
        )

async def process_rdv_cancelled(message: aio_pika.IncomingMessage):
    """Traiter un message d'annulation de RDV"""
    async with message.process():
        data = json.loads(message.body)
        print(f"❌ RDV annulé: {data}")

        send_email(
            to_email=SMTP_USER,
            subject="Annulation de votre rendez-vous médical",
            body=f"""
Bonjour,

Votre rendez-vous médical (ID: {data.get('rdv_id')}) a été annulé.

Si vous souhaitez reprendre un rendez-vous, connectez-vous sur notre plateforme.

L'équipe Médicale
            """
        )

async def start_consumer():
    """Démarrer le consommateur RabbitMQ"""
    print("🔄 Connexion à RabbitMQ...")
    connection = await aio_pika.connect_robust(RABBITMQ_URL)

    async with connection:
        channel = await connection.channel()

        # Écouter la queue rdv.created
        queue_created = await channel.declare_queue('rdv.created', durable=True)
        await queue_created.consume(process_rdv_created)

        # Écouter la queue rdv.cancelled
        queue_cancelled = await channel.declare_queue('rdv.cancelled', durable=True)
        await queue_cancelled.consume(process_rdv_cancelled)

        print("✅ Notification Service en écoute sur RabbitMQ...")
        await asyncio.Future()  # Garder le service actif
