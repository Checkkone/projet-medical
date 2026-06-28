import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { patientService } from '../services/api';

const DossierMedical = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    const chargerDossier = async () => {
      try {
        // Chercher le patient par userId
        const response = await patientService.getAll();
        const monProfil = response.data.find(
          p => p.userId === String(user?.id)
        );
        setPatient(monProfil || null);
      } catch (error) {
        setErreur('Impossible de charger votre dossier médical');
      } finally {
        setChargement(false);
      }
    };
    chargerDossier();
  }, [user]);

  if (chargement) {
    return (
      <div style={styles.container}>
        <div style={styles.navbar}>
          <span style={styles.logo}>🏥 Projet Médical</span>
        </div>
        <div style={styles.contenu}>
          <p style={{ textAlign: 'center', color: '#64748B' }}>
            Chargement de votre dossier...
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
        <h1 style={styles.titre}>👤 Mon Dossier Médical</h1>
        <p style={styles.sousTitre}>Vos informations médicales personnelles</p>

        {erreur && <div style={styles.erreur}>{erreur}</div>}

        {!patient ? (
          <div style={styles.vide}>
            <p style={styles.videTexte}>📭 Aucun dossier médical trouvé</p>
            <p style={styles.videInfo}>Votre dossier sera créé automatiquement</p>
          </div>
        ) : (
          <>
            {/* Infos générales */}
            <div style={styles.carte}>
              <h2 style={styles.carteTitre}>📋 Informations Générales</h2>
              <div style={styles.grille}>
                <div style={styles.item}>
                  <span style={styles.label}>Nom complet</span>
                  <span style={styles.valeur}>{patient.prenom} {patient.nom}</span>
                </div>
                <div style={styles.item}>
                  <span style={styles.label}>Date de naissance</span>
                  <span style={styles.valeur}>{patient.dateNaissance}</span>
                </div>
                <div style={styles.item}>
                  <span style={styles.label}>Téléphone</span>
                  <span style={styles.valeur}>{patient.telephone}</span>
                </div>
                <div style={styles.item}>
                  <span style={styles.label}>Adresse</span>
                  <span style={styles.valeur}>{patient.adresse}</span>
                </div>
                <div style={styles.item}>
                  <span style={styles.label}>Email</span>
                  <span style={styles.valeur}>{user?.email}</span>
                </div>
                <div style={styles.item}>
                  <span style={styles.label}>Statut</span>
                  <span style={{...styles.valeur, color: '#0F6E56', fontWeight: 'bold'}}>
                    ✅ Dossier actif
                  </span>
                </div>
              </div>
            </div>

            {/* Historique médical */}
            <div style={styles.carte}>
              <h2 style={styles.carteTitre}>🏥 Historique Médical</h2>
              {patient.historique && patient.historique.length > 0 ? (
                <div style={styles.tagContainer}>
                  {patient.historique.map((h, i) => (
                    <span key={i} style={styles.tagBleu}>{h}</span>
                  ))}
                </div>
              ) : (
                <p style={styles.videTexte}>Aucun historique médical enregistré</p>
              )}
            </div>
          </>
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
  carte: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    marginBottom: '24px',
  },
  carteTitre: { color: '#1B3A6B', marginBottom: '20px', fontSize: '18px' },
  grille: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  item: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    padding: '12px',
    backgroundColor: '#F8FAFC',
    borderRadius: '8px',
  },
  label: { fontSize: '12px', color: '#94A3B8', textTransform: 'uppercase' },
  valeur: { fontSize: '15px', color: '#1E293B', fontWeight: '500' },
  tagContainer: { display: 'flex', flexWrap: 'wrap', gap: '10px' },
  tagBleu: {
    padding: '8px 16px',
    backgroundColor: '#DBEAFE',
    color: '#1B3A6B',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '500',
  },
  vide: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '12px',
    textAlign: 'center',
  },
  videTexte: { color: '#94A3B8', fontSize: '16px', marginBottom: '8px' },
  videInfo: { color: '#CBD5E1', fontSize: '14px' },
};

export default DossierMedical;