from pydantic import BaseModel, Field
from fastapi import UploadFile
from typing import Optional, Dict
from enum import Enum


class AlzheimerClass(str, Enum):
    """Enum for Alzheimer's disease classification"""
    NON_DEMENTIA = "Non Dementia"
    VERY_MILD_DEMENTIA = "Very Mild Dementia"
    MILD_DEMENTIA = "Mild Dementia"
    MODERATE_DEMENTIA = "Moderate Dementia"

class AlzheimerResponse(BaseModel):
    disease: str = Field("Alzheimer", description="Name of the disease being detected")
    prediction_class: AlzheimerClass = Field(..., description="Predicted Alzheimer's class")
    confidence: float = Field(..., ge=0, le=1, description="Confidence score of the prediction")
    explanation: str = Field(..., description="LLM-generated explanation of the prediction")

class HeartDiseaseInput(BaseModel):
    age: int = Field(..., description="Age of the patient", ge=0, le=120)
    sex: int = Field(..., description="Gender (0: Female, 1: Male)", ge=0, le=1)
    cp: int = Field(..., description="Chest Pain Type (0-3)", ge=0, le=3)
    trtbps: int = Field(..., description="Resting Blood Pressure (in mm Hg)", ge=0)
    chol: int = Field(..., description="Serum Cholesterol (in mg/dl)", ge=0)
    restecg: int = Field(..., description="Resting Electrocardiographic Results (0-2)", ge=0, le=2)
    thalachh: int = Field(..., description="Maximum Heart Rate Achieved", ge=0)
    exng: int = Field(..., description="Exercise-Induced Angina (1: Yes, 0: No)", ge=0, le=1)
    oldpeak: float = Field(..., description="ST Depression Induced by Exercise")
    slp: int = Field(..., description="Slope of Peak Exercise ST Segment (0-2)", ge=0, le=2)
    caa: int = Field(..., description="Number of Major Vessels Colored by Fluoroscopy (0-3)", ge=0, le=3)
    thall: int = Field(..., description="Thalassemia Category (0-2)", ge=0, le=2)
    o2Saturation: float = Field(..., description="Oxygen Saturation Level (%)", ge=0, le=100)

    @property
    def features(self) -> list:
        return [self.age, self.sex, self.cp, self.trtbps, self.chol,
                self.restecg, self.thalachh, self.exng, self.oldpeak,
                self.slp, self.caa, self.thall, self.o2Saturation]

class DiabeticClass(str, Enum):
    """Enum for Diabetic Retinopathy classification"""
    HEALTHY = "No Diabetic Retinopathy"
    MILD = "Mild Diabetic Retinopathy"
    MODERATE = "Moderate Diabetic Retinopathy"
    PROLIFERATE = "Proliferative Diabetic Retinopathy"
    SEVERE = "Severe Diabetic Retinopathy"

class DiabeticResponse(BaseModel):
    disease: str = Field("Diabetic Retinopathy", description="Name of the disease being detected")
    prediction_class: DiabeticClass = Field(..., description="Predicted Diabetic Retinopathy class")
    confidence: float = Field(..., ge=0, le=1, description="Confidence score of the prediction")
    explanation: str = Field(..., description="LLM-generated explanation of the prediction")

class BrainTumorClass(str, Enum):
    """Enum for Brain Tumor classification"""
    NO = "No Tumor"
    YES = "Tumor Present"

class BrainTumorResponse(BaseModel):
    disease: str = Field("Brain Tumor", description="Name of the disease being detected")
    prediction_class: BrainTumorClass = Field(..., description="Predicted Brain Tumor class")
    confidence: float = Field(..., ge=0, le=1, description="Confidence score of the prediction")
    explanation: str = Field(..., description="LLM-generated explanation of the prediction")

class DetectionResponse(BaseModel):
    disease: str
    confidence: float
    explanation: str = Field(..., description="LLM-generated explanation of the prediction")