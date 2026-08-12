import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { rdvService } from '../services/api';

const DashboardMedecin = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [heure, setHeure] = useState('');
  const [menuActif, setMenuActif] = useState('accueil');
  const [rdvAujourdhui, setRdvAujourdhui] = useState([]);
  const [totalRdv, setTotalRdv] = useState(0);
  const [rdvEnAttente, setRdvEnAttente] = useState(0);
  const [chargement, setChargement] = useState(true);
  const [showFormDispo, setShowFormDispo] = useState(false);
  const [formDispo, setFormDispo] = useState({
    date_disponible: '',
    heure_debut: '',
    heure_fin: '',
  });
  const [successDispo, setSuccessDispo] = useState('');

  useEffect(() => {
    const h = new Date().getHours();
    if (h < 12) setHeure('Bonjour');
    else if (h < 18) setHeure('Bon après-midi');
    else setHeure('Bonsoir');
  }, []);

  useEffect(() => {
    const chargerDonnees = async () => {
      try {
        const response = await rdvService.getAll();
        const today = new Date().toISOString().split('T')[0];
        const rdvToday = response.data.filter(
          rdv => rdv.date_rdv && rdv.date_rdv.startsWith(today)
        );
        const enAttente = response.data.filter(
          rdv => rdv.statut === 'en attente'
        );
        setRdvAujourdhui(rdvToday);
        setTotalRdv(response.data.length);
        setRdvEnAttente(enAttente.length);
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

  const ajouterDisponibilite = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch('http://localhost:3003/api/disponibilites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        medecin_id: user?.id,
        date_disponible: formDispo.date_disponible,
        heure_debut: formDispo.heure_debut + ':00',
        heure_fin: formDispo.heure_fin + ':00',
        est_reserve: false,
      }),
    });
    if (response.ok) {
      setSuccessDispo('✅ Disponibilité ajoutée avec succès !');
      setFormDispo({ date_disponible: '', heure_debut: '', heure_fin: '' });
      setTimeout(() => setSuccessDispo(''), 3000);
    }
  } catch (error) {
    console.error('Erreur:', error);
  }
};

  const menuItems = [
    { id: 'accueil', icon: '🏠', label: 'Accueil' },
    { id: 'agenda', icon: '📅', label: 'Mon Agenda' },
    { id: 'disponibilites', icon: '🕐', label: 'Mes Disponibilités' },
    { id: 'patients', icon: '👥', label: 'Mes Patients' },
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
              onClick={() => setMenuActif(item.id)}
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
              {heure}, Dr. {user?.nom} ! 👨‍⚕️
            </h1>
            <p style={styles.headerSous}>
              Voici votre agenda du jour
            </p>
          </div>
          <div style={styles.headerRight}>
            <span style={styles.roleTag}>Médecin</span>
            <span style={styles.dateTag}>
              {new Date().toLocaleDateString('fr-FR', {
                weekday: 'long', day: 'numeric', month: 'long'
              })}
            </span>
          </div>
        </div>

        {/* KPI Cards */}
        <div style={styles.kpiGrille}>
          <div style={{...styles.kpiCarte, borderLeft: '4px solid #0F6E56'}}>
            <div style={styles.kpiIcone}>👥</div>
            <div>
              <p style={styles.kpiNombre}>{chargement ? '...' : totalRdv}</p>
              <p style={styles.kpiLabel}>Total Rendez-vous</p>
            </div>
          </div>

          <div style={{...styles.kpiCarte, borderLeft: '4px solid #1B3A6B'}}>
            <div style={styles.kpiIcone}>📅</div>
            <div>
              <p style={styles.kpiNombre}>{chargement ? '...' : rdvAujourdhui.length}</p>
              <p style={styles.kpiLabel}>RDV aujourd'hui</p>
            </div>
          </div>

          <div style={{...styles.kpiCarte, borderLeft: '4px solid #F59E0B'}}>
            <div style={styles.kpiIcone}>⏳</div>
            <div>
              <p style={styles.kpiNombre}>{chargement ? '...' : rdvEnAttente}</p>
              <p style={styles.kpiLabel}>RDV en attente</p>
            </div>
          </div>

          <div style={{...styles.kpiCarte, borderLeft: '4px solid #8B5CF6'}}>
            <div style={styles.kpiIcone}>⭐</div>
            <div>
              <p style={styles.kpiNombre}>4.8</p>
              <p style={styles.kpiLabel}>Satisfaction patients</p>
            </div>
          </div>
        </div>

        {/* Section Disponibilités */}
        {menuActif === 'disponibilites' && (
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitre}>🕐 Gérer mes Disponibilités</h2>
              <button
                onClick={() => setShowFormDispo(!showFormDispo)}
                style={styles.boutonAjouter}
              >
                + Ajouter un créneau
              </button>
            </div>

            {showFormDispo && (
              <div style={styles.formDispo}>
                {successDispo && (
                  <div style={styles.success}>{successDispo}</div>
                )}
                <form onSubmit={ajouterDisponibilite}>
                  <div style={styles.formGrille}>
                    <div style={styles.champ}>
                      <label style={styles.label}>📆 Date</label>
                      <input
                        type="date"
                        value={formDispo.date_disponible}
                        onChange={e => setFormDispo({...formDispo, date_disponible: e.target.value})}
                        style={styles.input}
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                    <div style={styles.champ}>
                      <label style={styles.label}>🕐 Heure début</label>
                      <input
                        type="time"
                        value={formDispo.heure_debut}
                        onChange={e => setFormDispo({...formDispo, heure_debut: e.target.value})}
                        style={styles.input}
                        required
                      />
                    </div>
                    <div style={styles.champ}>
                      <label style={styles.label}>🕐 Heure fin</label>
                      <input
                        type="time"
                        value={formDispo.heure_fin}
                        onChange={e => setFormDispo({...formDispo, heure_fin: e.target.value})}
                        style={styles.input}
                        required
                      />
                    </div>
                  </div>
                  <button type="submit" style={styles.boutonSoumettre}>
                    Enregistrer le créneau
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* Agenda du jour */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitre}>📋 Agenda du jour</h2>
          {rdvAujourdhui.length === 0 ? (
            <p style={styles.vide}>Aucun rendez-vous aujourd'hui</p>
          ) : (
            rdvAujourdhui.map(rdv => (
              <div key={rdv.id} style={styles.rdvItem}>
                <div style={styles.rdvHeure}>{rdv.heure_rdv}</div>
                <div style={styles.rdvInfo}>
                  <p style={styles.rdvPatient}>Patient ID : {rdv.patient_id}</p>
                  <p style={styles.rdvStatut}>{rdv.statut}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Graphique hebdomadaire */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitre}>📊 Vue hebdomadaire</h2>
          <div style={styles.graphique}>
            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((jour, i) => {
              const valeurs = [3, 5, 2, 4, 3, 1, 0];
              const max = Math.max(...valeurs, 1);
              return (
                <div key={jour} style={styles.barreContainer}>
                  <div style={styles.barreWrap}>
                    <div style={{
                      ...styles.barre,
                      height: `${(valeurs[i] / max) * 100}%`,
                      backgroundColor: i === new Date().getDay() - 1 ? '#0F6E56' : '#D1FAE5'
                    }}/>
                  </div>
                  <span style={styles.barreMois}>{jour}</span>
                  <span style={styles.barreVal}>{valeurs[i]}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
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
    backgroundColor: '#0F6E56',
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
  main: { marginLeft: '240px', flex: 1, padding: '32px' },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  headerTitre: { color: '#0F6E56', fontSize: '26px', margin: '0 0 4px 0' },
  headerSous: { color: '#64748B', margin: 0 },
  headerRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' },
  roleTag: {
    backgroundColor: '#D1FAE5',
    color: '#0F6E56',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  dateTag: { color: '#94A3B8', fontSize: '13px' },
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
  kpiNombre: { fontSize: '28px', fontWeight: 'bold', color: '#0F6E56', margin: '0 0 4px 0' },
  kpiLabel: { color: '#94A3B8', fontSize: '12px', margin: 0 },
  section: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  sectionTitre: { color: '#0F6E56', marginBottom: '20px', fontSize: '16px' },
  vide: { color: '#94A3B8', textAlign: 'center', padding: '20px' },
  rdvItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '12px',
    backgroundColor: '#F8FAFC',
    borderRadius: '8px',
    marginBottom: '8px',
  },
  rdvHeure: {
    backgroundColor: '#D1FAE5',
    color: '#0F6E56',
    padding: '8px 12px',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '14px',
  },
  rdvInfo: {},
  rdvPatient: { color: '#1E293B', fontWeight: '500', margin: '0 0 2px 0' },
  rdvStatut: { color: '#94A3B8', fontSize: '12px', margin: 0 },
  boutonAjouter: {
    backgroundColor: '#0F6E56',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  formDispo: {
    backgroundColor: '#F8FAFC',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  formGrille: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
    marginBottom: '16px',
  },
  champ: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', color: '#374151', fontWeight: '500' },
  input: {
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #CBD5E1',
    fontSize: '14px',
    outline: 'none',
  },
  boutonSoumettre: {
    backgroundColor: '#0F6E56',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  success: {
    backgroundColor: '#D1FAE5',
    color: '#0F6E56',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '16px',
  },
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
  },
  barreMois: { color: '#94A3B8', fontSize: '11px', marginTop: '4px' },
  barreVal: { color: '#0F6E56', fontSize: '12px', fontWeight: 'bold' },
};

export default DashboardMedecin;