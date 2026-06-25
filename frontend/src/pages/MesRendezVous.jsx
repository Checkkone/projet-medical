import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { rdvService } from '../services/api';

const MesRendezVous = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rendezVous, setRendezVous] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');

  // Charger les vrais RDV depuis le service
  useEffect(() => {
    const chargerRdv = async () => {
      try {
        const response = await rdvService.getAll();
        // Filtrer les RDV du patient connecté
        const mesRdv = response.data.filter(
  rdv => parseInt(rdv.patient_id) === parseInt(user?.id)
);
        setRendezVous(mesRdv);
      } catch (error) {
        setErreur('Impossible de charger vos rendez-vous');
      } finally {
        setChargement(false);
      }
    };
    chargerRdv();
  }, [user]);

  const annuler = async (id) => {
    try {
      await rdvService.delete(id);
      setRendezVous(rendezVous.filter(rdv => rdv.id !== id));
    } catch (error) {
      setErreur('Erreur lors de l\'annulation');
    }
  };

  const couleurStatut = (statut) => {
    if (statut === 'confirme') return { backgroundColor: '#D1FAE5', color: '#0F6E56' };
    if (statut === 'en attente') return { backgroundColor: '#FEF3C7', color: '#92400E' };
    return { backgroundColor: '#FEE2E2', color: '#A32D2D' };
  };

  if (chargement) {
    return (
      <div style={styles.container}>
        <div style={styles.navbar}>
          <span style={styles.logo}>🏥 Projet Médical</span>
        </div>
        <div style={styles.contenu}>
          <p style={{ textAlign: 'center', color: '#64748B' }}>
            Chargement de vos rendez-vous...
          </p>
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
        <h1 style={styles.titre}>📋 Mes Rendez-vous</h1>
        <p style={styles.sousTitre}>Liste de tous vos rendez-vous médicaux</p>

        {erreur && <div style={styles.erreur}>{erreur}</div>}

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
                    <h3 style={styles.medecin}>👨‍⚕️ Médecin ID : {rdv.medecin_id}</h3>
                    <p style={styles.specialite}>Patient ID : {rdv.patient_id}</p>
                  </div>
                  <span style={{...styles.statut, ...couleurStatut(rdv.statut)}}>
                    {rdv.statut}
                  </span>
                </div>

                <div style={styles.carteBody}>
                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>📆 Date</span>
                    <span style={styles.infoValeur}>
                      {new Date(rdv.date_rdv).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>🕐 Heure</span>
                    <span style={styles.infoValeur}>{rdv.heure_rdv}</span>
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>👤 Patient</span>
                    <span style={styles.infoValeur}>{user?.nom}</span>
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>📋 Statut</span>
                    <span style={styles.infoValeur}>{rdv.statut}</span>
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
  erreur: {
    backgroundColor: '#FEE2E2',
    color: '#A32D2D',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '16px',
  },
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