 const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
require('dotenv').config();

const router = express.Router();

// Route POST /register — Créer un compte
router.post('/register', async (req, res) => {
  try {
    const { nom, email, password, role } = req.body;

    // Vérifier si l'email existe déjà
    const userExiste = await pool.query(
      'SELECT * FROM users WHERE email = $1', [email]
    );
    if (userExiste.rows.length > 0) {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }

    // Chiffrer le mot de passe
    const passwordHash = await bcrypt.hash(password, 10);

    // Sauvegarder dans la base de données
    const newUser = await pool.query(
      'INSERT INTO users (nom, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, nom, email, role',
      [nom, email, passwordHash, role || 'patient']
    );

    res.status(201).json({
      message: 'Compte créé avec succès',
      user: newUser.rows[0]
    });

  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// Route POST /login — Se connecter
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Chercher l'utilisateur
    const user = await pool.query(
      'SELECT * FROM users WHERE email = $1', [email]
    );
    if (user.rows.length === 0) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Vérifier le mot de passe
    const passwordValide = await bcrypt.compare(password, user.rows[0].password_hash);
    if (!passwordValide) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Créer le token JWT
    const token = jwt.sign(
      { id: user.rows[0].id, email: user.rows[0].email, role: user.rows[0].role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Connexion réussie',
      token,
      user: {
        id: user.rows[0].id,
        nom: user.rows[0].nom,
        email: user.rows[0].email,
        role: user.rows[0].role
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

module.exports = router;
