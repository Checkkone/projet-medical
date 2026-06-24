import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MesRendezVous = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Données de test — seront remplacées par l'API plus tard
  const [rendezVous, setRendezVous] = useState([
    {
      id: 1,
      medecin: 'Dr. Martin',
      specialite: 'Généraliste',
      date: '2026-07-15',
      heure: '09:00',
      motif: 'Consultation générale',
      statut: 'confirmé',
    },
    {
      id: 2,
      medecin: 'Dr. Dupont',
      specialite: 'Cardiologue',
      date: '2026-07-20',
      heure: '14:30',
      motif: 'Contrôle cardiaque',
      statut: 'en attente',
    },
  ]);

  const annuler = (id) => {
    setRendezVous(rendezVous.filter(rdv => rdv.id !== id));
  };

  const couleurStatut = (statut) => {
    if (statut === 'confirmé') return { backgroundColor: '#D1FAE5', color: '#0F6E56' };
    if (statut === 'en attente') return { backgroundColor: '#FEF3C7', color: '#92400E' };
    return { backgroundColor: '#FEE2E2', color: '#A32D2D' };
  };

  return (
    <div style={styles.container}>
      <div style={styles.navbar}>
        <span style={styles.logo}>🏥 Projet Médical</span>
        <button onClick={() => navigate('/dashboard')} style={styles.boutonRetour}>
          ← Retour au Dashboard
        </button>
      </div>

      <div style={styles.contenu}>
        <h1 style={styles.titre}>📋 Mes Rendez-vous</h1>
        <p style={styles.sousTitre}>Liste de tous vos rendez-vous médicaux</p>

        {rendezVous.length === 0 ? (
          <div style={styles.vide}>
            <p style={styles.videTexte}>📭 Aucun rendez-vous pour le moment</p>
            <button
              onClick={() => navigate('/rendez-vous')}
              style={styles.boutonPrendre}
            >
              Prendre un rendez-vous
            </button>
          </div>
        ) : (
          <div style={styles.liste}>
            {rendezVous.map(rdv => (
              <div key={rdv.id} style={styles.carte}>
                <div style={styles.carteHeader}>
                  <div>
                    <h3 style={styles.medecin}>👨‍⚕️ {rdv.medecin}</h3>
                    <p style={styles.specialite}>{rdv.specialite}</p>
                  </div>
                  <span style={{...styles.statut, ...couleurStatut(rdv.statut)}}>
                    {rdv.statut}
                  </span>
                </div>

                <div style={styles.carteBody}>
                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>📆 Date</span>
                    <span style={styles.infoValeur}>{rdv.date}</span>
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>🕐 Heure</span>
                    <span style={styles.infoValeur}>{rdv.heure}</span>
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>📝 Motif</span>
                    <span style={styles.infoValeur}>{rdv.motif}</span>
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>👤 Patient</span>
                    <span style={styles.infoValeur}>{user?.nom}</span>
                  </div>
                </div>

                <div style={styles.carteFooter}>
                  <button
                    onClick={() => annuler(rdv.id)}
                    style={styles.boutonAnnuler}
                  >
                    ❌ Annuler le RDV
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={() => navigate('/rendez-vous')}
              style={styles.boutonNouveau}
            >
              + Prendre un nouveau rendez-vous
            </button>
          </div>
        )}
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
  contenu: { padding: '32px', maxWidth: '800px', margin: '0 auto' },
  titre: { color: '#1B3A6B', marginBottom: '8px' },
  sousTitre: { color: '#64748B', marginBottom: '32px' },
  liste: { display: 'flex', flexDirection: 'column', gap: '20px' },
  carte: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    overflow: 'hidden',
  },
  carteHeader: {
    padding: '20px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #F1F5F9',
    backgroundColor: '#F8FAFC',
  },
  medecin: { color: '#1B3A6B', margin: '0 0 4px 0', fontSize: '18px' },
  specialite: { color: '#64748B', margin: 0, fontSize: '14px' },
  statut: {
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  carteBody: {
    padding: '20px 24px',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  infoItem: { display: 'flex', flexDirection: 'column', gap: '4px' },
  infoLabel: { fontSize: '12px', color: '#94A3B8' },
  infoValeur: { fontSize: '15px', color: '#1E293B', fontWeight: '500' },
  carteFooter: {
    padding: '16px 24px',
    borderTop: '1px solid #F1F5F9',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  boutonAnnuler: {
    padding: '8px 16px',
    backgroundColor: '#FEE2E2',
    color: '#A32D2D',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
  },
  boutonNouveau: {
    padding: '14px',
    backgroundColor: '#1B3A6B',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: 'bold',
    width: '100%',
  },
  vide: {
    backgroundColor: 'white',
    padding: '60px',
    borderRadius: '12px',
    textAlign: 'center',
  },
  videTexte: { color: '#94A3B8', fontSize: '18px', marginBottom: '24px' },
  boutonPrendre: {
    padding: '12px 32px',
    backgroundColor: '#1B3A6B',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '15px',
  },
};

export default MesRendezVous;