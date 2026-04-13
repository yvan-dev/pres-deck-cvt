FROM node:20-alpine

WORKDIR /app

# Copier et installer les dépendances
COPY package.json .
RUN npm install --production

# Copier le code serveur
COPY index.js .

# Le fichier tasks.json est monté via volume (pas copié dans l'image)
# pour permettre aux agents de le modifier depuis l'hôte

EXPOSE 3001

CMD ["node", "index.js"]
