import axios from 'axios';

// URLs des services
const AUTH_URL = 'http://localhost:3001';
const PATIENT_URL = 'http://localhost:3002';
const RDV_URL = 'http://localhost:3003';

// Instance axios avec token automatique
const createApi = (baseURL) => {
  const instance = axios.create({ baseURL });
  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  return instance;
};

const authApi = createApi(AUTH_URL);
const patientApi = createApi(PATIENT_URL);
const rdvApi = createApi(RDV_URL);

// Services Auth
export const authService = {
  register: (data) => authApi.post('/api/auth/register', data),
  login: (data) => authApi.post('/api/auth/login', data),
  verifyToken: () => authApi.get('/api/auth/verify-token'),
};

// Services Patients
export const patientService = {
  getAll: () => patientApi.get('/patients'),
  getById: (id) => patientApi.get(`/patients/${id}`),
  create: (data) => patientApi.post('/patients', data),
  update: (id, data) => patientApi.put(`/patients/${id}`, data),
  getDossier: (id) => patientApi.get(`/patients/${id}/dossier`),
};

// Services RDV
export const rdvService = {
  getAll: () => rdvApi.get('/api/rdv'),
  create: (data) => rdvApi.post('/api/rdv', data),
  update: (id, data) => rdvApi.put(`/api/rdv/${id}`, data),
  delete: (id) => rdvApi.delete(`/api/rdv/${id}`),
  getDisponibilites: () => rdvApi.get('/api/disponibilites'),
};

export default authApi;