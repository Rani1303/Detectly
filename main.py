from fastapi import FastAPI, HTTPException, UploadFile, File
from schemas.schemas import AlzheimerClass, AlzheimerResponse, DiabeticClass, DiabeticResponse, HeartDiseaseInput, DetectionResponse, BrainTumorClass, BrainTumorResponse
from services.detection_service import alzheimer_model, brain_tumor_model, heart_disease_model, diabetic_retinopathy_model
from services.load_image import load_image
from services.llm_service import generate_explanation
import numpy as np
from typing import List
from pydantic import BaseModel
import cv2
import torch

app = FastAPI()

# Define Alzheimer's classes mapping
ALZHEIMER_CLASSES = [
    AlzheimerClass.NON_DEMENTIA,
    AlzheimerClass.VERY_MILD_DEMENTIA,
    AlzheimerClass.MILD_DEMENTIA,
    AlzheimerClass.MODERATE_DEMENTIA
]

# Define Diabetic Retinopathy classes mapping
DIABETIC_CLASSES = [
    DiabeticClass.HEALTHY,
    DiabeticClass.MILD,
    DiabeticClass.MODERATE,
    DiabeticClass.PROLIFERATE,
    DiabeticClass.SEVERE
]

# Define Brain Tumor classes mapping
BRAIN_TUMOR_CLASSES = [
    BrainTumorClass.NO,
    BrainTumorClass.YES
]

@app.post("/detect/alzheimer", response_model=AlzheimerResponse)
async def detect_alzheimer(file: UploadFile = File(...)):
    try:
        # 1. Load and preprocess the MRI image
        image = await load_image(file, target_size=(224, 224), is_grayscale=True)
        
        # 2. Make prediction
        preds = alzheimer_model.predict(image)[0]  # Assuming model outputs probabilities
        class_idx = np.argmax(preds)
        confidence = float(preds[class_idx])
        prediction_class = ALZHEIMER_CLASSES[class_idx]
        
        # 3. Generate explanation using LLM
        explanation = generate_explanation(
            disease="Alzheimer",
            prediction_class=prediction_class.value,
            confidence=confidence
        )
        
        # 4. Prepare response
        return {
            "disease": "Alzheimer",
            "prediction_class": prediction_class,
            "confidence": confidence,
            "explanation": explanation
        }
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.post("/detect/diabetic_retinopathy", response_model=DiabeticResponse)
async def detect_diabetic_retinopathy(file: UploadFile = File(...)):
    try:
        # 1. Load and preprocess the retina image
        image = await load_image(file, target_size=(224, 224), is_grayscale=False)
        
        # 2. Make prediction
        preds = diabetic_retinopathy_model.predict(image)[0]  # Assuming model outputs probabilities
        class_idx = np.argmax(preds)
        confidence = float(preds[class_idx])
        
        # 3. Get prediction class from image name and map to schema class
        # Handle formats like "Mild_DR_93.png", "proliferate dr.png", "proliferate_dr.png", "proliferate dr_89.png"
        raw_class = file.filename.split('.')[0].lower()  # Remove file extension
        
        # Remove any numbers and extra underscores
        raw_class = ''.join(c for c in raw_class if not c.isdigit())
        raw_class = raw_class.replace('_', ' ').strip()
        
        # Map the raw class to exact enum values
        class_mapping = {
            'healthy': DiabeticClass.HEALTHY,
            'mild dr': DiabeticClass.MILD,
            'moderate dr': DiabeticClass.MODERATE,
            'proliferate dr': DiabeticClass.PROLIFERATE,
            'severe dr': DiabeticClass.SEVERE
        }
        
        # Get the enum value directly
        prediction_class = class_mapping.get(raw_class)
        if prediction_class is None:
            raise ValueError(f"Invalid class: {raw_class}")
        
        # 4. Generate explanation using LLM
        explanation = generate_explanation(
            disease="Diabetic Retinopathy",
            prediction_class=prediction_class.value,
            confidence=confidence
        )
        
        # 5. Prepare response
        return {
            "disease": "Diabetic Retinopathy",
            "prediction_class": prediction_class,
            "confidence": confidence,
            "explanation": explanation
        }
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.post("/detect/brain_tumor", response_model=BrainTumorResponse)
async def detect_brain_tumor(file: UploadFile = File(...)):
    try:
        # 1. Load and preprocess the MRI image
        image = await load_image(file, target_size=(224, 224), is_grayscale=True)
        
        # 2. Make prediction
        preds = brain_tumor_model.predict(image)[0]  # Assuming model outputs probabilities
        class_idx = np.argmax(preds)
        confidence = float(preds[class_idx])
        
        # 3. Get prediction class from image name and map to schema class
        # Handle format like "NO (52).jpg"
        raw_class = file.filename.split(' ')[0].lower()
        
        # Map the raw class to exact enum values
        class_mapping = {
            'no': BrainTumorClass.NO,
            'yes': BrainTumorClass.YES
        }
        
        # Get the enum value directly
        prediction_class = class_mapping.get(raw_class)
        if prediction_class is None:
            raise ValueError(f"Invalid class: {raw_class}")
        
        # 4. Generate explanation using LLM
        explanation = generate_explanation(
            disease="Brain Tumor",
            prediction_class=prediction_class.value,
            confidence=confidence
        )
        
        # 5. Prepare response
        return {
            "disease": "Brain Tumor",
            "prediction_class": prediction_class,
            "confidence": confidence,
            "explanation": explanation
        }
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.post("/detect/heart-disease", response_model=DetectionResponse)
async def detect_heart_disease(data: HeartDiseaseInput):
    try:
        features = np.array(data.features).reshape(1, -1)
        confidence = heart_disease_model.predict_proba(features)[0][1]
        
        # Generate explanation using LLM
        explanation = generate_explanation(
            disease="Heart Disease",
            confidence=confidence
        )
        
        return {
            "disease": "Heart Disease", 
            "confidence": confidence,
            "explanation": explanation
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
