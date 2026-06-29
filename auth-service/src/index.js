const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const { initDatabase } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Route de test
app.get('/health', (req, res) => {
  res.json({ message: 'Auth Service fonctionne !' });
});

// Démarrer le serveur
const startServer = async () => {
  await initDatabase();
  app.listen(PORT, () => {
    console.log(`✅ Auth Service démarré sur le port ${PORT}`);
  });
};

startServer();