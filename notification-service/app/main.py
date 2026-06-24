import asyncio
from app.consumer import start_consumer

if __name__ == "__main__":
    print("🚀 Démarrage du Notification Service...")
    asyncio.run(start_consumer()) 
