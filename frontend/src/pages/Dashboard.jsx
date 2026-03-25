import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <div style={styles.navbar}>
        <h2 style={styles.logo}>Projet Medical</h2>
        <div style={styles.navRight}>
          <span style={styles.nomUser}>Bonjour, {user?.nom}</span>
          <button onClick={handleLogout} style={styles.boutonLogout}>
            Se déconnecter
          </button>
        </div>
      </div>

      <div style={styles.contenu}>
        <h1 style={styles.titre}>Tableau de bord</h1>

        <div style={styles.grille}>
          <div style={styles.carte}>
            <h3 style={styles.carteTitre}>Mes Rendez-vous</h3>
            <p style={styles.carteNombre}>0</p>
            <p style={styles.carteTexte}>Rendez-vous à venir</p>
          </div>

          <div style={styles.carte}>
            <h3 style={styles.carteTitre}>Mon Profil</h3>
            <p style={styles.carteTexte}>{user?.email}</p>
            <p style={styles.carteRole}>{user?.role}</p>
          </div>

          <div style={styles.carte}>
            <h3 style={styles.carteTitre}>Notifications</h3>
            <p style={styles.carteNombre}>0</p>
            <p style={styles.carteTexte}>Nouveaux messages</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f0f4f8',
  },
  navbar: {
    backgroundColor: '#1B3A6B',
    padding: '16px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    color: 'white',
    margin: 0,
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  nomUser: {
    color: 'white',
    fontSize: '14px',
  },
  boutonLogout: {
    backgroundColor: 'transparent',
    border: '1px solid white',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  contenu: {
    padding: '32px',
  },
  titre: {
    color: '#1B3A6B',
    marginBottom: '24px',
  },
  grille: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px',
  },
  carte: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  },
  carteTitre: {
    color: '#1B3A6B',
    marginBottom: '12px',
    fontSize: '16px',
  },
  carteNombre: {
    fontSize: '48px',
    fontWeight: 'bold',
    color: '#1B3A6B',
    margin: '0 0 8px 0',
  },
  carteTexte: {
    color: '#64748B',
    fontSize: '14px',
    margin: 0,
  },
  carteRole: {
    color: '#0F6E56',
    fontSize: '14px',
    fontWeight: '500',
    textTransform: 'capitalize',
    margin: '4px 0 0 0',
  },
};

export default Dashboard; 
