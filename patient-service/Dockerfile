# Image Python de base
FROM python:3.11-slim

# Dossier de travail dans le conteneur
WORKDIR /app

# Copier et installer les dépendances d'abord (optimisation cache Docker)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copier tout le code source
COPY . .

# Port exposé par le service
EXPOSE 3002

# Commande pour démarrer le service
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "3002"]
