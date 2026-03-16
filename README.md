# Projet Medical — Système de Gestion de Rendez-vous

Application web de gestion de rendez-vous médicaux
construite avec une architecture microservices.

## Étudiants
- Étudiant 1 (Checkkone) — Frontend + Auth Service
- Étudiant 2 — Backend + Infrastructure

## Technologies
- Frontend : React.js
- Auth Service : Node.js + Express
- Patient Service : Python + FastAPI
- RDV Service : Node.js + Express
- Bases de données : PostgreSQL + MongoDB
- Containerisation : Docker + Docker Compose
- CI/CD : GitHub Actions

## Prérequis
- Node.js 18+
- Python 3.11+
- Docker Desktop

## Lancer le projet
```bash
docker compose up
```

## Structure du projet
- auth-service/ — Service d'authentification (JWT)
- frontend/ — Interface React.js
- nginx/ — API Gateway
- patient-service/ — Gestion des patients
- rdv-service/ — Gestion des rendez-vous
- notification-service/ — Envoi d'emails