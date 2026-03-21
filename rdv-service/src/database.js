const { Pool } = require('pg');
require('dotenv').config();

// Connexion à PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5433,
  database: process.env.DB_NAME || 'rdv_db',
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'secret123',
});

// Créer les tables si elles n'existent pas
const initDatabase = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS medecins (
        id SERIAL PRIMARY KEY,
        nom VARCHAR(100) NOT NULL,
        prenom VARCHAR(100) NOT NULL,
        specialite VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS disponibilites (
        id SERIAL PRIMARY KEY,
        medecin_id INTEGER REFERENCES medecins(id),
        date_disponible DATE NOT NULL,
        heure_debut TIME NOT NULL,
        heure_fin TIME NOT NULL,
        est_reserve BOOLEAN DEFAULT FALSE
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS rendez_vous (
        id SERIAL PRIMARY KEY,
        patient_id VARCHAR(100) NOT NULL,
        medecin_id INTEGER REFERENCES medecins(id),
        disponibilite_id INTEGER REFERENCES disponibilites(id),
        date_rdv DATE NOT NULL,
        heure_rdv TIME NOT NULL,
        statut VARCHAR(50) DEFAULT 'confirme',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log('✅ Tables créées avec succès');
  } catch (error) {
    console.error('❌ Erreur création tables:', error.message);
  }
};

module.exports = { pool, initDatabase };