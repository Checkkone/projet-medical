from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import patients

app = FastAPI(
    title="Patient Service",
    description="Microservice de gestion des profils patients",
    version="1.0.0"
)

# Autoriser les requêtes du Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Enregistrer les routes
app.include_router(patients.router, tags=["Patients"])

@app.get("/")
async def root():
    return {"message": "Patient Service opérationnel", "status": "ok"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}