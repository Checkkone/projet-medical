import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { rdvService } from '../services/api';

const RendezVous = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [disponibilites, setDisponibilites] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');
  const [confirmation, setConfirmation] = useState(null);

  const [formData, setFormData] = useState({
    disponibilite_id: '',
    motif: '',
  });

  // Charger les disponibilités depuis le vrai service
  useEffect(() => {
    const chargerDisponibilites = async () => {
      try {
        const response = await rdvService.getDisponibilites();
        setDisponibilites(response.data);
      } catch (error) {
        setErreur('Impossible de charger les disponibilités');
      } finally {
        setChargement(false);
      }
    };
    chargerDisponibilites();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.disponibilite_id || !formData.motif) {
      setErreur('Veuillez remplir tous les champs');
      return;
    }

    const dispo = disponibilites.find(d => d.id === parseInt(formData.disponibilite_id));

    try {
      await rdvService.create({
        patient_id: user?.id,
        medecin_id: dispo.medecin_id,
        disponibilite_id: parseInt(formData.disponibilite_id),
        date_rdv: dispo.date_disponible,
        heure_rdv: dispo.heure_debut,
      });
      setConfirmation(dispo);
    } catch (error) {
      setErreur('Erreur lors de la création du rendez-vous');
    }
  };

  if (chargement) {
    return (
      <div style={styles.container}>
        <div style={styles.navbar}>
          <span style={styles.logo}>🏥 Projet Médical</span>
        </div>
        <div style={styles.contenu}>
          <p style={{ textAlign: 'center', color: '#64748B' }}>
            Chargement des disponibilités...
          </p>
        </div>
      </div>
    );
  }

  if (confirmation) {
    return (
      <div style={styles.container}>
        <div style={styles.navbar}>
          <span style={styles.logo}>🏥 Projet Médical</span>
          <button onClick={() => navigate('/dashboard')} style={styles.boutonRetour}>
            ← Retour au Dashboard
          </button>
        </div>
        <div style={styles.contenu}>
          <div style={styles.confirmationCard}>
            <div style={styles.checkmark}>✅</div>
            <h2 style={styles.confirmTitre}>Rendez-vous confirmé !</h2>
            <p style={styles.confirmTexte}>Votre rendez-vous a été enregistré avec succès.</p>
            <div style={styles.confirmDetails}>
              <div style={styles.confirmItem}>
                <span style={styles.confirmLabel}>Médecin</span>
                <span style={styles.confirmValeur}>Dr. {confirmation.prenom} {confirmation.nom}</span>
              </div>
              <div style={styles.confirmItem}>
                <span style={styles.confirmLabel}>Spécialité</span>
                <span style={styles.confirmValeur}>{confirmation.specialite}</span>
              </div>
              <div style={styles.confirmItem}>
                <span style={styles.confirmLabel}>Date</span>
                <span style={styles.confirmValeur}>
                  {new Date(confirmation.date_disponible).toLocaleDateString('fr-FR')}
                </span>
              </div>
              <div style={styles.confirmItem}>
                <span style={styles.confirmLabel}>Heure</span>
                <span style={styles.confirmValeur}>{confirmation.heure_debut}</span>
              </div>
              <div style={styles.confirmItem}>
                <span style={styles.confirmLabel}>Patient</span>
                <span style={styles.confirmValeur}>{user?.nom}</span>
              </div>
              <div style={styles.confirmItem}>
                <span style={styles.confirmLabel}>Motif</span>
                <span style={styles.confirmValeur}>{formData.motif}</span>
              </div>
            </div>
            <button onClick={() => navigate('/dashboard')} style={styles.boutonDashboard}>
              Retour au Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.navbar}>
        <span style={styles.logo}>🏥 Projet Médical</span>
        <button onClick={() => navigate('/dashboard')} style={styles.boutonRetour}>
          ← Retour au Dashboard
        </button>
      </div>

      <div style={styles.contenu}>
        <h1 style={styles.titre}>📅 Prendre un Rendez-vous</h1>
        <p style={styles.sousTitre}>Choisissez un créneau disponible</p>

        <div style={styles.formCard}>
          {erreur && <div style={styles.erreur}>{erreur}</div>}

          <form onSubmit={handleSubmit}>
            <div style={styles.champ}>
              <label style={styles.label}>👨‍⚕️ Choisir un créneau disponible</label>
              <select
                value={formData.disponibilite_id}
                onChange={(e) => setFormData({ ...formData, disponibilite_id: e.target.value })}
                style={styles.input}
              >
                <option value="">-- Sélectionner un créneau --</option>
                {disponibilites.map(d => (
                  <option key={d.id} value={d.id}>
                    Dr. {d.prenom} {d.nom} ({d.specialite}) —{' '}
                    {new Date(d.date_disponible).toLocaleDateString('fr-FR')} à {d.heure_debut}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.champ}>
              <label style={styles.label}>📝 Motif de la consultation</label>
              <textarea
                value={formData.motif}
                onChange={(e) => setFormData({ ...formData, motif: e.target.value })}
                style={{ ...styles.input, height: '100px', resize: 'vertical' }}
                placeholder="Décrivez brièvement le motif de votre consultation..."
              />
            </div>

            <button type="submit" style={styles.boutonSoumettre}>
              Confirmer le rendez-vous
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#F0F4F8', fontFamily: 'Arial, sans-serif' },
  navbar: {
    backgroundColor: '#1B3A6B',
    padding: '14px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: { color: 'white', fontSize: '20px', fontWeight: 'bold' },
  boutonRetour: {
    backgroundColor: 'transparent',
    border: '1px solid white',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
  },
  contenu: { padding: '32px', maxWidth: '700px', margin: '0 auto' },
  titre: { color: '#1B3A6B', marginBottom: '8px' },
  sousTitre: { color: '#64748B', marginBottom: '32px' },
  formCard: {
    backgroundColor: 'white',
    padding: '32px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  erreur: {
    backgroundColor: '#FEE2E2',
    color: '#A32D2D',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '14px',
  },
  champ: { marginBottom: '20px' },
  label: { display: 'block', marginBottom: '8px', color: '#374151', fontSize: '14px', fontWeight: '500' },
  input: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #CBD5E1',
    fontSize: '14px',
    boxSizing: 'border-box',
    outline: 'none',
    fontFamily: 'Arial, sans-serif',
  },
  boutonSoumettre: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#1B3A6B',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginTop: '8px',
  },
  confirmationCard: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    textAlign: 'center',
    maxWidth: '500px',
    margin: '0 auto',
  },
  checkmark: { fontSize: '64px', marginBottom: '16px' },
  confirmTitre: { color: '#0F6E56', marginBottom: '8px' },
  confirmTexte: { color: '#64748B', marginBottom: '24px' },
  confirmDetails: { textAlign: 'left', marginBottom: '24px' },
  confirmItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 0',
    borderBottom: '1px solid #F1F5F9',
  },
  confirmLabel: { color: '#94A3B8', fontSize: '14px' },
  confirmValeur: { color: '#1E293B', fontSize: '14px', fontWeight: '500' },
  boutonDashboard: {
    padding: '12px 32px',
    backgroundColor: '#1B3A6B',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    cursor: 'pointer',
  },
};

export default RendezVous;