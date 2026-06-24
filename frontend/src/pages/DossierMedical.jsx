import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DossierMedical = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [dossier] = useState({
    groupeSanguin: 'A+',
    taille: '175 cm',
    poids: '70 kg',
    allergies: ['Pénicilline', 'Arachides'],
    antecedents: ['Hypertension (2020)', 'Appendicite (2018)'],
    medicaments: ['Amlodipine 5mg', 'Aspirine 100mg'],
  });

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

        {/* Infos générales */}
        <div style={styles.carte}>
          <h2 style={styles.carteTitre}>📋 Informations Générales</h2>
          <div style={styles.grille}>
            <div style={styles.item}>
              <span style={styles.label}>Nom complet</span>
              <span style={styles.valeur}>{user?.nom}</span>
            </div>
            <div style={styles.item}>
              <span style={styles.label}>Email</span>
              <span style={styles.valeur}>{user?.email}</span>
            </div>
            <div style={styles.item}>
              <span style={styles.label}>Groupe sanguin</span>
              <span style={{...styles.valeur, color: '#A32D2D', fontWeight: 'bold'}}>
                {dossier.groupeSanguin}
              </span>
            </div>
            <div style={styles.item}>
              <span style={styles.label}>Taille</span>
              <span style={styles.valeur}>{dossier.taille}</span>
            </div>
            <div style={styles.item}>
              <span style={styles.label}>Poids</span>
              <span style={styles.valeur}>{dossier.poids}</span>
            </div>
          </div>
        </div>

        {/* Allergies */}
        <div style={styles.carte}>
          <h2 style={styles.carteTitre}>⚠️ Allergies</h2>
          <div style={styles.tagContainer}>
            {dossier.allergies.map((a, i) => (
              <span key={i} style={styles.tagRouge}>{a}</span>
            ))}
          </div>
        </div>

        {/* Antécédents */}
        <div style={styles.carte}>
          <h2 style={styles.carteTitre}>🏥 Antécédents Médicaux</h2>
          <div style={styles.tagContainer}>
            {dossier.antecedents.map((a, i) => (
              <span key={i} style={styles.tagBleu}>{a}</span>
            ))}
          </div>
        </div>

        {/* Médicaments */}
        <div style={styles.carte}>
          <h2 style={styles.carteTitre}>💊 Médicaments en cours</h2>
          <div style={styles.tagContainer}>
            {dossier.medicaments.map((m, i) => (
              <span key={i} style={styles.tagVert}>{m}</span>
            ))}
          </div>
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
  contenu: { padding: '32px', maxWidth: '800px', margin: '0 auto' },
  titre: { color: '#1B3A6B', marginBottom: '8px' },
  sousTitre: { color: '#64748B', marginBottom: '32px' },
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
  tagRouge: {
    padding: '8px 16px',
    backgroundColor: '#FEE2E2',
    color: '#A32D2D',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '500',
  },
  tagBleu: {
    padding: '8px 16px',
    backgroundColor: '#DBEAFE',
    color: '#1B3A6B',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '500',
  },
  tagVert: {
    padding: '8px 16px',
    backgroundColor: '#D1FAE5',
    color: '#0F6E56',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '500',
  },
};

export default DossierMedical;