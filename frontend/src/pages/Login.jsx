 import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur('');
    setChargement(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      setErreur('Email ou mot de passe incorrect');
    } finally {
      setChargement(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.titre}>Connexion</h1>
        <p style={styles.sousTitre}>Système de Gestion Médicale</p>

        {erreur && <div style={styles.erreur}>{erreur}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.champ}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder="votre@email.com"
              required
            />
          </div>

          <div style={styles.champ}>
            <label style={styles.label}>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="Votre mot de passe"
              required
            />
          </div>

          <button
            type="submit"
            style={chargement ? styles.boutonDesactive : styles.bouton}
            disabled={chargement}
          >
            {chargement ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <p style={styles.lien}>
          Pas encore de compte ?{' '}
          <Link to="/register" style={styles.linkTexte}>
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f4f8',
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px',
  },
  titre: {
    textAlign: 'center',
    color: '#1B3A6B',
    marginBottom: '8px',
  },
  sousTitre: {
    textAlign: 'center',
    color: '#64748B',
    marginBottom: '24px',
    fontSize: '14px',
  },
  erreur: {
    backgroundColor: '#FEE2E2',
    color: '#A32D2D',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '14px',
  },
  champ: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    color: '#374151',
    fontSize: '14px',
    fontWeight: '500',
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #CBD5E1',
    fontSize: '14px',
    boxSizing: 'border-box',
    outline: 'none',
  },
  bouton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#1B3A6B',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '8px',
  },
  boutonDesactive: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#94A3B8',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'not-allowed',
    marginTop: '8px',
  },
  lien: {
    textAlign: 'center',
    marginTop: '16px',
    fontSize: '14px',
    color: '#64748B',
  },
  linkTexte: {
    color: '#1B3A6B',
    fontWeight: '500',
  },
};

export default Login;
