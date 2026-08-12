import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { rdvService, patientService } from '../services/api';
import DashboardMedecin from './DashboardMedecin';

const DashboardPatient = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [heure, setHeure] = useState('');
  const [nbRdv, setNbRdv] = useState(0);
  const [prochainRdv, setProchainRdv] = useState(null);
  const [hasDossier, setHasDossier] = useState(false);
  const [menuActif, setMenuActif] = useState('accueil');
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    const h = new Date().getHours();
    if (h < 12) setHeure('Bonjour');
    else if (h < 18) setHeure('Bon après-midi');
    else setHeure('Bonsoir');
  }, []);

  useEffect(() => {
    const chargerDonnees = async () => {
      try {
        const rdvResponse = await rdvService.getAll();
        const mesRdv = rdvResponse.data.filter(
          rdv => parseInt(rdv.patient_id) === parseInt(user?.id)
        );
        setNbRdv(mesRdv.length);
        if (mesRdv.length > 0) setProchainRdv(mesRdv[0]);

        const patientResponse = await patientService.getAll();
        const monProfil = patientResponse.data.find(
          p => p.userId === String(user?.id)
        );
        setHasDossier(!!monProfil);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setChargement(false);
      }
    };
    chargerDonnees();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { id: 'accueil', icon: '🏠', label: 'Accueil' },
    { id: 'rdv', icon: '📅', label: 'Mes RDV', path: '/rendez-vous' },
    { id: 'mes-rdv', icon: '📋', label: 'Historique RDV', path: '/mes-rendez-vous' },
    { id: 'dossier', icon: '🗂️', label: 'Mon Dossier', path: '/dossier-medical' },
    { id: 'profil', icon: '👤', label: 'Mon Profil' },
  ];

  return (
    <div style={styles.container}>

      {/* Barre latérale */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarLogo}>
          <span style={styles.logoIcon}>🏥</span>
          <span style={styles.logoText}>MediCare</span>
        </div>

        <nav style={styles.nav}>
          {menuItems.map(item => (
            <button
              key={item.id}
              style={{
                ...styles.navItem,
                ...(menuActif === item.id ? styles.navItemActif : {})
              }}
              onClick={() => {
                setMenuActif(item.id);
                if (item.path) navigate(item.path);
              }}
            >
              <span style={styles.navIcon}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <button onClick={handleLogout} style={styles.boutonLogout}>
          🚪 Déconnexion
        </button>
      </div>

      {/* Contenu principal */}
      <div style={styles.main}>

        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.headerTitre}>
              {heure}, {user?.nom} ! 👋
            </h1>
            <p style={styles.headerSous}>
              Voici votre suivi médical du mois
            </p>
          </div>
          <div style={styles.headerRight}>
            <span style={styles.roleTag}>Patient</span>
            <span style={styles.dateTag}>
              {new Date().toLocaleDateString('fr-FR', {
                weekday: 'long', day: 'numeric', month: 'long'
              })}
            </span>
          </div>
        </div>

        {/* Bannière prochain RDV */}
        {prochainRdv && (
          <div style={styles.banniere}>
            <div>
              <p style={styles.banniereLabel}>🔔 Prochain rendez-vous</p>
              <p style={styles.banniereDate}>
                {new Date(prochainRdv.date_rdv).toLocaleDateString('fr-FR')} à {prochainRdv.heure_rdv}
              </p>
            </div>
            <button
              onClick={() => navigate('/mes-rendez-vous')}
              style={styles.banniereBtn}
            >
              Voir détails →
            </button>
          </div>
        )}

        {/* KPI Cards */}
        <div style={styles.kpiGrille}>
          <div style={{...styles.kpiCarte, borderLeft: '4px solid #1B3A6B'}}>
            <div style={styles.kpiIcone}>📅</div>
            <div>
              <p style={styles.kpiNombre}>{chargement ? '...' : nbRdv}</p>
              <p style={styles.kpiLabel}>RDV Total</p>
            </div>
          </div>

          <div style={{...styles.kpiCarte, borderLeft: '4px solid #0F6E56'}}>
            <div style={styles.kpiIcone}>✅</div>
            <div>
              <p style={styles.kpiNombre}>{chargement ? '...' : nbRdv}</p>
              <p style={styles.kpiLabel}>Consultations effectuées</p>
            </div>
          </div>

          <div style={{...styles.kpiCarte, borderLeft: '4px solid #F59E0B'}}>
            <div style={styles.kpiIcone}>👨‍⚕️</div>
            <div>
              <p style={styles.kpiNombre}>0</p>
              <p style={styles.kpiLabel}>Médecins consultés</p>
            </div>
          </div>

          <div style={{...styles.kpiCarte, borderLeft: '4px solid #8B5CF6'}}>
            <div style={styles.kpiIcone}>💊</div>
            <div>
              <p style={styles.kpiNombre}>0</p>
              <p style={styles.kpiLabel}>Ordonnances actives</p>
            </div>
          </div>
        </div>

        {/* Historique graphique simplifié */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitre}>📊 Historique des consultations (6 mois)</h2>
          <div style={styles.graphique}>
            {['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'].map((mois, i) => {
              const valeurs = [2, 1, 3, 0, 2, nbRdv];
              const max = Math.max(...valeurs, 1);
              return (
                <div key={mois} style={styles.barreContainer}>
                  <div style={styles.barreWrap}>
                    <div style={{
                      ...styles.barre,
                      height: `${(valeurs[i] / max) * 100}%`,
                      backgroundColor: i === 5 ? '#1B3A6B' : '#DBEAFE'
                    }}/>
                  </div>
                  <span style={styles.barreMois}>{mois}</span>
                  <span style={styles.barreVal}>{valeurs[i]}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions rapides */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitre}>⚡ Actions Rapides</h2>
          <div style={styles.actionsGrille}>
            <button
              style={{...styles.actionBtn, backgroundColor: '#1B3A6B'}}
              onClick={() => navigate('/rendez-vous')}
            >
              📅 Prendre un RDV
            </button>
            <button
              style={{...styles.actionBtn, backgroundColor: '#0F6E56'}}
              onClick={() => navigate('/dossier-medical')}
            >
              🗂️ Mon dossier médical
            </button>
            <button
              style={{...styles.actionBtn, backgroundColor: '#F59E0B'}}
              onClick={() => navigate('/mes-rendez-vous')}
            >
              📋 Voir mes RDV
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  if (user?.role === 'medecin') return <DashboardMedecin />;
  return <DashboardPatient />;
};

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#F0F4F8',
    fontFamily: 'Arial, sans-serif',
  },
  sidebar: {
    width: '240px',
    backgroundColor: '#1B3A6B',
    display: 'flex',
    flexDirection: 'column',
    padding: '24px 0',
    position: 'fixed',
    height: '100vh',
    zIndex: 100,
  },
  sidebarLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '0 24px 32px 24px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  logoIcon: { fontSize: '28px' },
  logoText: { color: 'white', fontSize: '20px', fontWeight: 'bold' },
  nav: { flex: 1, padding: '16px 12px' },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    width: '100%',
    padding: '12px 16px',
    backgroundColor: 'transparent',
    border: 'none',
    color: 'rgba(255,255,255,0.7)',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    marginBottom: '4px',
    textAlign: 'left',
  },
  navItemActif: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    color: 'white',
    fontWeight: 'bold',
  },
  navIcon: { fontSize: '18px' },
  boutonLogout: {
    margin: '0 12px',
    padding: '12px 16px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    border: 'none',
    color: 'white',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    textAlign: 'left',
  },
  main: {
    marginLeft: '240px',
    flex: 1,
    padding: '32px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  headerTitre: { color: '#1B3A6B', fontSize: '26px', margin: '0 0 4px 0' },
  headerSous: { color: '#64748B', margin: 0 },
  headerRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' },
  roleTag: {
    backgroundColor: '#DBEAFE',
    color: '#1B3A6B',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  dateTag: { color: '#94A3B8', fontSize: '13px' },
  banniere: {
    backgroundColor: '#1B3A6B',
    borderRadius: '12px',
    padding: '20px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  banniereLabel: { color: 'rgba(255,255,255,0.8)', margin: '0 0 4px 0', fontSize: '13px' },
  banniereDate: { color: 'white', fontWeight: 'bold', fontSize: '18px', margin: 0 },
  banniereBtn: {
    backgroundColor: 'white',
    color: '#1B3A6B',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  kpiGrille: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
    marginBottom: '24px',
  },
  kpiCarte: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  kpiIcone: { fontSize: '32px' },
  kpiNombre: { fontSize: '28px', fontWeight: 'bold', color: '#1B3A6B', margin: '0 0 4px 0' },
  kpiLabel: { color: '#94A3B8', fontSize: '12px', margin: 0 },
  section: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  sectionTitre: { color: '#1B3A6B', marginBottom: '20px', fontSize: '16px' },
  graphique: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '16px',
    height: '150px',
  },
  barreContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    height: '100%',
  },
  barreWrap: {
    flex: 1,
    width: '100%',
    display: 'flex',
    alignItems: 'flex-end',
  },
  barre: {
    width: '100%',
    borderRadius: '4px 4px 0 0',
    minHeight: '4px',
    transition: 'height 0.3s',
  },
  barreMois: { color: '#94A3B8', fontSize: '11px', marginTop: '4px' },
  barreVal: { color: '#1B3A6B', fontSize: '12px', fontWeight: 'bold' },
  actionsGrille: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
  },
  actionBtn: {
    padding: '16px',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
  },
};

export default Dashboard;