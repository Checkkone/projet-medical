from fastapi import FastAPI
from app.routers import patients

app = FastAPI(
    title="Patient Service",
    description="Microservice de gestion des profils patients",
    version="1.0.0"
)

# Enregistrer les routes
app.include_router(patients.router, tags=["Patients"])

@app.get("/")
async def root():
    """Route de vérification — le service est vivant ?"""
    return {"message": "Patient Service opérationnel", "status": "ok"}

@app.get("/health")
async def health_check():
    """Route de santé pour Docker"""
    return {"status": "healthy"}
