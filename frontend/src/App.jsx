import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import RendezVous from './pages/RendezVous';
import MesRendezVous from './pages/MesRendezVous';
import DossierMedical from './pages/DossierMedical';

const RouteProtegee = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Chargement...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={
            <RouteProtegee><Dashboard /></RouteProtegee>
          } />
          <Route path="/rendez-vous" element={
            <RouteProtegee><RendezVous /></RouteProtegee>
          } />
          <Route path="/mes-rendez-vous" element={
            <RouteProtegee><MesRendezVous /></RouteProtegee>
          } />
          <Route path="/dossier-medical" element={
            <RouteProtegee><DossierMedical /></RouteProtegee>
          } />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;