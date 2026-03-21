const request = require('supertest');
const app = require('../src/app');

// Mock de la base de données pour ne pas avoir besoin de PostgreSQL
jest.mock('../src/database', () => ({
  pool: {
    query: jest.fn(),
  },
  initDatabase: jest.fn().mockResolvedValue(),
}));

const { pool } = require('../src/database');

// Test 1 — Vérifier que le service est vivant
describe('GET /', () => {
  it('devrait retourner le service opérationnel', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });
});

// Test 2 — Vérifier la route de santé
describe('GET /health', () => {
  it('devrait retourner healthy', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('healthy');
  });
});

// Test 3 — Liste des rendez-vous
describe('GET /api/rdv', () => {
  it('devrait retourner une liste de rendez-vous', async () => {
    pool.query.mockResolvedValue({ rows: [] });
    const response = await request(app).get('/api/rdv');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});

// Test 4 — Liste des disponibilités
describe('GET /api/disponibilites', () => {
  it('devrait retourner une liste de disponibilités', async () => {
    pool.query.mockResolvedValue({ rows: [] });
    const response = await request(app).get('/api/disponibilites');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});