import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RendezVous = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    medecin: '',
    date: '',
    heure: '',
    motif: '',
  });

  const [confirmation, setConfirmation] = useState(false);
  const [erreur, setErreur] = useState('');

  const medecins = [
    { id: 1, nom: 'Dr. Martin', specialite: 'Généraliste' },
    { id: 2, nom: 'Dr. Dupont', specialite: 'Cardiologue' },
    { id: 3, nom: 'Dr. Bernard', specialite: 'Dermatologue' },
    { id: 4, nom: 'Dr. Leblanc', specialite: 'Pédiatre' },
  ];

  const heures = [
    '08:00', '08:30', '09:00', '09:30', '10:00',
    '10:30', '11:00', '11:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00',
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.medecin || !formData.date || !formData.heure || !formData.motif) {
      setErreur('Veuillez remplir tous les champs');
      return;
    }
    setErreur('');
    setConfirmation(true);
  };

  if (confirmation) {
    const medecin = medecins.find(m => m.id === parseInt(formData.medecin));
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
                <span style={styles.confirmValeur}>{medecin?.nom} — {medecin?.specialite}</span>
              </div>
              <div style={styles.confirmItem}>
                <span style={styles.confirmLabel}>Date</span>
                <span style={styles.confirmValeur}>{formData.date}</span>
              </div>
              <div style={styles.confirmItem}>
                <span style={styles.confirmLabel}>Heure</span>
                <span style={styles.confirmValeur}>{formData.heure}</span>
              </div>
              <div style={styles.confirmItem}>
                <span style={styles.confirmLabel}>Motif</span>
                <span style={styles.confirmValeur}>{formData.motif}</span>
              </div>
              <div style={styles.confirmItem}>
                <span style={styles.confirmLabel}>Patient</span>
                <span style={styles.confirmValeur}>{user?.nom}</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              style={styles.boutonDashboard}
            >
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
        <p style={styles.sousTitre}>Remplissez le formulaire pour réserver votre créneau</p>

        <div style={styles.formCard}>
          {erreur && <div style={styles.erreur}>{erreur}</div>}

          <form onSubmit={handleSubmit}>

            <div style={styles.champ}>
              <label style={styles.label}>👨‍⚕️ Choisir un médecin</label>
              <select
                name="medecin"
                value={formData.medecin}
                onChange={handleChange}
                style={styles.input}
              >
                <option value="">-- Sélectionner un médecin --</option>
                {medecins.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.nom} — {m.specialite}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.grille2}>
              <div style={styles.champ}>
                <label style={styles.label}>📆 Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  style={styles.input}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div style={styles.champ}>
                <label style={styles.label}>🕐 Heure</label>
                <select
                  name="heure"
                  value={formData.heure}
                  onChange={handleChange}
                  style={styles.input}
                >
                  <option value="">-- Choisir une heure --</option>
                  {heures.map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={styles.champ}>
              <label style={styles.label}>📝 Motif de la consultation</label>
              <textarea
                name="motif"
                value={formData.motif}
                onChange={handleChange}
                style={{...styles.input, height: '100px', resize: 'vertical'}}
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
  grille2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
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