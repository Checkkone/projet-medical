# Utiliser Node.js version 18
FROM node:18-alpine

# Créer le dossier de travail dans le conteneur
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le code source
COPY . .

# Exposer le port 3001
EXPOSE 3001

# Démarrer le service
CMD ["node", "src/index.js"]