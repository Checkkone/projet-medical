from pydantic import BaseModel, Field
from typing import Optional
from datetime import date

class PatientCreate(BaseModel):
    """Données nécessaires pour créer un patient"""
    userId: str
    nom: str
    prenom: str
    dateNaissance: date
    telephone: Optional[str] = None
    adresse: Optional[str] = None

class PatientUpdate(BaseModel):
    """Données modifiables d'un patient"""
    nom: Optional[str] = None
    prenom: Optional[str] = None
    telephone: Optional[str] = None
    adresse: Optional[str] = None

class PatientResponse(BaseModel):
    """Ce qu'on renvoie quand on retourne un patient"""
    id: str
    userId: str
    nom: str
    prenom: str
    dateNaissance: date
    telephone: Optional[str] = None
    adresse: Optional[str] = None
    historique: list = []