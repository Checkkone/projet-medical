# Utiliser Node.js version 18
FROM node:20-alpine

# Créer le dossier de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le code source
COPY . .

# Exposer le port 5173
EXPOSE 5173

# Lancer l'application en mode développement
CMD ["npm", "run", "dev", "--", "--host"]