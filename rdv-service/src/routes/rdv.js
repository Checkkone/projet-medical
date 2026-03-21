const express = require('express');
const router = express.Router();
const { pool } = require('../database');

// GET /rdv — Liste tous les rendez-vous
router.get('/rdv', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM rendez_vous ORDER BY date_rdv DESC'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ erreur: error.message });
  }
});

// POST /rdv — Créer un rendez-vous
router.post('/rdv', async (req, res) => {
  try {
    const { patient_id, medecin_id, disponibilite_id, date_rdv, heure_rdv } = req.body;

    // Vérifier que le créneau est disponible
    const dispo = await pool.query(
      'SELECT * FROM disponibilites WHERE id = $1 AND est_reserve = FALSE',
      [disponibilite_id]
    );

    if (dispo.rows.length === 0) {
      return res.status(400).json({ erreur: 'Créneau non disponible' });
    }

    // Créer le rendez-vous
    const result = await pool.query(
      `INSERT INTO rendez_vous (patient_id, medecin_id, disponibilite_id, date_rdv, heure_rdv)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [patient_id, medecin_id, disponibilite_id, date_rdv, heure_rdv]
    );

    // Marquer le créneau comme réservé
    await pool.query(
      'UPDATE disponibilites SET est_reserve = TRUE WHERE id = $1',
      [disponibilite_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ erreur: error.message });
  }
});

// PUT /rdv/:id — Modifier un rendez-vous
router.put('/rdv/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { statut } = req.body;

    const result = await pool.query(
      'UPDATE rendez_vous SET statut = $1 WHERE id = $2 RETURNING *',
      [statut, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ erreur: 'Rendez-vous non trouvé' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ erreur: error.message });
  }
});

// DELETE /rdv/:id — Annuler un rendez-vous
router.delete('/rdv/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Récupérer le RDV pour libérer le créneau
    const rdv = await pool.query(
      'SELECT * FROM rendez_vous WHERE id = $1',
      [id]
    );

    if (rdv.rows.length === 0) {
      return res.status(404).json({ erreur: 'Rendez-vous non trouvé' });
    }

    // Libérer le créneau
    await pool.query(
      'UPDATE disponibilites SET est_reserve = FALSE WHERE id = $1',
      [rdv.rows[0].disponibilite_id]
    );

    // Supprimer le RDV
    await pool.query('DELETE FROM rendez_vous WHERE id = $1', [id]);

    res.json({ message: 'Rendez-vous annulé avec succès' });
  } catch (error) {
    res.status(500).json({ erreur: error.message });
  }
});

// GET /disponibilites — Liste les créneaux disponibles
router.get('/disponibilites', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT d.*, m.nom, m.prenom, m.specialite 
       FROM disponibilites d
       JOIN medecins m ON d.medecin_id = m.id
       WHERE d.est_reserve = FALSE
       ORDER BY d.date_disponible, d.heure_debut`
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ erreur: error.message });
  }
});

module.exports = router;