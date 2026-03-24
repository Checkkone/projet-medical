import axios from 'axios';

// URL de base de l'API Gateway
const API_URL = 'http://localhost:80';

// Créer une instance axios
const api = axios.create({
  baseURL: API_URL,
});

// Ajouter le token JWT automatiquement à chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Services Auth
export const authService = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
  verifyToken: () => api.get('/api/auth/verify-token'),
};

// Services Patients
export const patientService = {
  getAll: () => api.get('/api/patients'),
  getById: (id) => api.get(`/api/patients/${id}`),
  create: (data) => api.post('/api/patients', data),
  update: (id, data) => api.put(`/api/patients/${id}`, data),
};

// Services RDV
export const rdvService = {
  getAll: () => api.get('/api/rdv'),
  create: (data) => api.post('/api/rdv', data),
  update: (id, data) => api.put(`/api/rdv/${id}`, data),
  delete: (id) => api.delete(`/api/rdv/${id}`),
  getDisponibilites: () => api.get('/api/rdv/disponibilites'),
};

export default api; 
