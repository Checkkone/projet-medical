const request = require('supertest');
const express = require('express');
const authRoutes = require('../src/routes/auth');

// Créer une app de test
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth Service — Tests', () => {

  // Test 1 : Register
  test('POST /register — créer un compte avec succès', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        nom: 'Test User',
        email: `test${Date.now()}@gmail.com`,
        password: 'motdepasse123',
        role: 'patient'
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Compte créé avec succès');
    expect(response.body.user).toHaveProperty('id');
    expect(response.body.user).toHaveProperty('email');
  });

  // Test 2 : Register avec email déjà utilisé
  test('POST /register — refuser un email déjà utilisé', async () => {
    const email = `doublon${Date.now()}@gmail.com`;

    // Premier register
    await request(app)
      .post('/api/auth/register')
      .send({ nom: 'User 1', email, password: '123456', role: 'patient' });

    // Deuxième register avec le même email
    const response = await request(app)
      .post('/api/auth/register')
      .send({ nom: 'User 2', email, password: '123456', role: 'patient' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Email déjà utilisé');
  });

  // Test 3 : Login réussi
  test('POST /login — connexion réussie', async () => {
    const email = `login${Date.now()}@gmail.com`;

    // Créer le compte d'abord
    await request(app)
      .post('/api/auth/register')
      .send({ nom: 'Login User', email, password: 'motdepasse123', role: 'patient' });

    // Se connecter
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email, password: 'motdepasse123' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Connexion réussie');
    expect(response.body).toHaveProperty('token');
  });

  // Test 4 : Login avec mauvais mot de passe
  test('POST /login — refuser un mauvais mot de passe', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'jean@gmail.com', password: 'mauvaismdp' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Email ou mot de passe incorrect');
  });

});