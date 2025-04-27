import joblib
import torch
from tensorflow import keras

#Load Alzheimer model
alzheimer_model = keras.models.load_model("models/alzheimers_model.h5")
alzheimer_model.save("models/alzheimers_model.keras")


#Load diabetic retinopathy model
diabetic_retinopathy_model=keras.models.load_model("models/diabetic_retinopathy_model.h5")
diabetic_retinopathy_model.save("models/diabetic_retinopathy_model.keras")

# Load Brain Tumor model
brain_tumor_model = keras.models.load_model("models/brain_tumor_model.h5")
brain_tumor_model.save("models/brain_tumor_model.keras")

# Load Heart Disease model
heart_disease_model = joblib.load("models/heart_disease_model.pkl")
