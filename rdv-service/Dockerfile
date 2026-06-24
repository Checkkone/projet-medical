# Image Node.js de base
FROM node:18-alpine

# Dossier de travail dans le conteneur
WORKDIR /app

# Copier et installer les dépendances d'abord (optimisation cache Docker)
COPY package*.json ./
RUN npm install --production

# Copier tout le code source
COPY . .

# Port exposé par le service
EXPOSE 3003

# Commande pour démarrer le service
CMD ["node", "src/app.js"]