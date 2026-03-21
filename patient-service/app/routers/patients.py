from fastapi import APIRouter, HTTPException
from app.models import PatientCreate, PatientUpdate, PatientResponse
from app.database import get_database
from bson import ObjectId
from datetime import datetime

router = APIRouter()

def patient_helper(patient) -> dict:
    """Convertit un document MongoDB en dictionnaire lisible"""
    return {
        "id": str(patient["_id"]),
        "userId": patient["userId"],
        "nom": patient["nom"],
        "prenom": patient["prenom"],
        "dateNaissance": patient["dateNaissance"],
        "telephone": patient.get("telephone"),
        "adresse": patient.get("adresse"),
        "historique": patient.get("historique", []),
    }

@router.get("/patients")
async def get_patients():
    """Récupérer la liste de tous les patients"""
    db = get_database()
    patients = []
    async for patient in db["patients"].find():
        patients.append(patient_helper(patient))
    return patients

@router.post("/patients", status_code=201)
async def create_patient(patient: PatientCreate):
    """Créer un nouveau patient"""
    db = get_database()
    patient_dict = patient.model_dump()
    patient_dict["dateNaissance"] = str(patient_dict["dateNaissance"])
    patient_dict["historique"] = []
    patient_dict["createdAt"] = str(datetime.now())
    result = await db["patients"].insert_one(patient_dict)
    new_patient = await db["patients"].find_one({"_id": result.inserted_id})
    return patient_helper(new_patient)

@router.get("/patients/{patient_id}")
async def get_patient(patient_id: str):
    """Récupérer un patient par son ID"""
    db = get_database()
    patient = await db["patients"].find_one({"_id": ObjectId(patient_id)})
    if not patient:
        raise HTTPException(status_code=404, detail="Patient non trouvé")
    return patient_helper(patient)

@router.put("/patients/{patient_id}")
async def update_patient(patient_id: str, patient_data: PatientUpdate):
    """Modifier les informations d'un patient"""
    db = get_database()
    update_data = {k: v for k, v in patient_data.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="Aucune donnée à modifier")
    result = await db["patients"].update_one(
        {"_id": ObjectId(patient_id)},
        {"$set": update_data}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Patient non trouvé")
    patient = await db["patients"].find_one({"_id": ObjectId(patient_id)})
    return patient_helper(patient)

@router.get("/patients/{patient_id}/dossier")
async def get_dossier(patient_id: str):
    """Récupérer le dossier médical d'un patient"""
    db = get_database()
    patient = await db["patients"].find_one({"_id": ObjectId(patient_id)})
    if not patient:
        raise HTTPException(status_code=404, detail="Patient non trouvé")
    return {
        "patient_id": patient_id,
        "nom": patient["nom"],
        "prenom": patient["prenom"],
        "historique": patient.get("historique", [])
    }