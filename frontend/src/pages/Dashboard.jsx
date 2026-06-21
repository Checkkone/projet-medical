import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [heure, setHeure] = useState('');

  // Afficher un message selon l'heure
  useEffect(() => {
    const h = new Date().getHours();
    if (h < 12) setHeure('Bonjour');
    else if (h < 18) setHeure('Bon après-midi');
    else setHeure('Bonsoir');
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={styles.container}>

      {/* Navbar */}
      <div style={styles.navbar}>
        <div style={styles.navLeft}>
          <span style={styles.logo}>🏥 Projet Médical</span>
        </div>
        <div style={styles.navRight}>
          <span style={styles.nomUser}>👤 {user?.nom}</span>
          <span style={styles.roleTag}>{user?.role}</span>
          <button onClick={handleLogout} style={styles.boutonLogout}>
            Déconnexion
          </button>
        </div>
      </div>

      {/* Contenu */}
      <div style={styles.contenu}>

        {/* Message de bienvenue */}
        <div style={styles.bienvenue}>
          <h1 style={styles.titrebien}>{heure}, {user?.nom} ! 👋</h1>
          <p style={styles.soustitre}>Bienvenue sur votre espace médical personnel</p>
        </div>

        {/* Cartes statistiques */}
        <div style={styles.grille}>

          <div style={{...styles.carte, borderTop: '4px solid #1B3A6B'}}>
            <div style={styles.carteIcone}>📅</div>
            <h3 style={styles.carteTitre}>Rendez-vous</h3>
            <p style={styles.carteNombre}>0</p>
            <p style={styles.carteTexte}>À venir</p>
          </div>

          <div style={{...styles.carte, borderTop: '4px solid #0F6E56'}}>
            <div style={styles.carteIcone}>👨‍⚕️</div>
            <h3 style={styles.carteTitre}>Médecins</h3>
            <p style={styles.carteNombre}>0</p>
            <p style={styles.carteTexte}>Disponibles</p>
          </div>

          <div style={{...styles.carte, borderTop: '4px solid #F59E0B'}}>
            <div style={styles.carteIcone}>🔔</div>
            <h3 style={styles.carteTitre}>Notifications</h3>
            <p style={styles.carteNombre}>0</p>
            <p style={styles.carteTexte}>Nouveaux messages</p>
          </div>

        </div>

        {/* Informations profil */}
        <div style={styles.profilCard}>
          <h2 style={styles.profilTitre}>Mon Profil</h2>
          <div style={styles.profilGrille}>
            <div style={styles.profilItem}>
              <span style={styles.profilLabel}>Nom complet</span>
              <span style={styles.profilValeur}>{user?.nom}</span>
            </div>
            <div style={styles.profilItem}>
              <span style={styles.profilLabel}>Email</span>
              <span style={styles.profilValeur}>{user?.email}</span>
            </div>
            <div style={styles.profilItem}>
              <span style={styles.profilLabel}>Rôle</span>
              <span style={styles.profilValeur}>{user?.role}</span>
            </div>
            <div style={styles.profilItem}>
              <span style={styles.profilLabel}>Statut</span>
              <span style={{...styles.profilValeur, color: '#0F6E56', fontWeight: 'bold'}}>✅ Connecté</span>
            </div>
          </div>
        </div>

        {/* Actions rapides */}
<div style={styles.actionsCard}>
  <h2 style={styles.profilTitre}>Actions Rapides</h2>
  <div style={styles.boutonsGrille}>
    <button
      style={styles.actionBouton}
      onClick={() => navigate('/rendez-vous')}
    >
      📅 Prendre un RDV
    </button>
    <button
      style={styles.actionBouton}
      onClick={() => navigate('/mes-rdv')}
    >
      📋 Voir mes RDV
    </button>
    <button
      style={styles.actionBouton}
      onClick={() => navigate('/profil')}
    >
      👤 Mon dossier médical
    </button>
  </div>
</div>

      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#F0F4F8',
    fontFamily: 'Arial, sans-serif',
  },
  navbar: {
    backgroundColor: '#1B3A6B',
    padding: '14px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
  },
  navLeft: { display: 'flex', alignItems: 'center' },
  logo: { color: 'white', fontSize: '20px', fontWeight: 'bold' },
  navRight: { display: 'flex', alignItems: 'center', gap: '16px' },
  nomUser: { color: 'white', fontSize: '14px' },
  roleTag: {
    backgroundColor: '#0F6E56',
    color: 'white',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    textTransform: 'capitalize',
  },
  boutonLogout: {
    backgroundColor: 'transparent',
    border: '1px solid white',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
  },
  contenu: { padding: '32px', maxWidth: '1100px', margin: '0 auto' },
  bienvenue: { marginBottom: '32px' },
  titrebien: { color: '#1B3A6B', fontSize: '28px', margin: '0 0 8px 0' },
  soustitre: { color: '#64748B', margin: 0 },
  grille: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px',
    marginBottom: '32px',
  },
  carte: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    textAlign: 'center',
  },
  carteIcone: { fontSize: '32px', marginBottom: '8px' },
  carteTitre: { color: '#374151', fontSize: '14px', margin: '0 0 8px 0' },
  carteNombre: { fontSize: '42px', fontWeight: 'bold', color: '#1B3A6B', margin: '0 0 4px 0' },
  carteTexte: { color: '#94A3B8', fontSize: '13px', margin: 0 },
  profilCard: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    marginBottom: '24px',
  },
  profilTitre: { color: '#1B3A6B', marginBottom: '20px', fontSize: '18px' },
  profilGrille: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
  },
  profilItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    padding: '12px',
    backgroundColor: '#F8FAFC',
    borderRadius: '8px',
  },
  profilLabel: { fontSize: '12px', color: '#94A3B8', textTransform: 'uppercase' },
  profilValeur: { fontSize: '15px', color: '#1E293B', fontWeight: '500' },
  actionsCard: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  boutonsGrille: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
  },
  actionBouton: {
    padding: '16px',
    backgroundColor: '#F0F4F8',
    border: '2px solid #E2E8F0',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#1B3A6B',
    fontWeight: '500',
    transition: 'all 0.2s',
  },
};

export default Dashboard;