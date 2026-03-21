const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { initDatabase } = require('./database');
const rdvRoutes = require('./routes/rdv');

const app = express();
const PORT = process.env.PORT || 3003;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', rdvRoutes);

// Route de vérification
app.get('/', (req, res) => {
  res.json({ message: 'RDV Service opérationnel', status: 'ok' });
});

// Route de santé
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Démarrer le serveur
const startServer = async () => {
  await initDatabase();
  app.listen(PORT, () => {
    console.log(`✅ RDV Service démarré sur le port ${PORT}`);
  });
};

startServer();

module.exports = app;