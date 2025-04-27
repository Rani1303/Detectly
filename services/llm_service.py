import google.generativeai as genai
from typing import Optional
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get API key from environment variable
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found in environment variables. Please check your .env file.")

# Initialize Gemini
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-2.0-flash')

def get_risk_level(confidence: float) -> str:
    """Determine risk level based on confidence score."""
    if confidence < 0.5:
        return "Low Risk"
    elif confidence < 0.7:
        return "Moderate Risk"
    else:
        return "High Risk"

def generate_explanation(
    disease: str,
    prediction_class: Optional[str] = None,
    confidence: float = 0.0
) -> str:
    """
    Generate a medical consultation response for the disease prediction.
    
    Args:
        disease: Name of the disease
        prediction_class: Predicted class (if applicable)
        confidence: Confidence score of the prediction
        
    Returns:
        str: Generated medical consultation
    """
    # Special handling for heart disease
    if disease == "Heart Disease":
        risk_level = get_risk_level(confidence)
        prompt = f"""As a cardiologist, provide a professional medical assessment for the following case:

Patient's Condition: Heart Disease Risk Assessment
Risk Level: {risk_level} (Confidence: {confidence:.2%})

Please provide a structured medical assessment in the following format:

1. Key Findings:
   - List 3-4 specific observations about the patient's cardiac health
   - Include relevant vital signs and risk factors
   - Note any concerning patterns

2. Medical Assessment:
   - Current condition and severity
   - Whether immediate medical attention is required
   - Specific risk factors present

3. Recommendations:
   - Immediate actions required (if any)
   - Lifestyle modifications
   - Follow-up schedule
   - Emergency care instructions (if applicable)

4. Health Management Plan:
   - Specific dietary guidelines
   - Exercise recommendations
   - Medication considerations (if applicable)
   - Monitoring requirements

5. Important Notes:
   - Warning signs to watch for
   - Risk factors to avoid
   - When to seek emergency care

Please maintain a professional, caring tone while being direct and clear about the medical implications. 
If the risk level is high (confidence > 70%), emphasize the urgency of seeking immediate medical attention.
If the risk level is moderate (confidence 50-70%), focus on preventive measures and lifestyle changes.
If the risk level is low (confidence < 50%), provide guidance on maintaining heart health.

Format the response in a clear, structured manner that a patient can easily understand."""
    else:
        # Specialized prompts for each disease type
        if disease == "Brain Tumor":
            prompt = f"""As a neurosurgeon, provide a professional medical assessment for the following case:

Patient's Condition: Brain Tumor Assessment
Assessment: {prediction_class}
Confidence Level: {confidence:.2%}

Please provide a structured medical assessment in the following format:

1. Key Findings:
   - List 3-4 specific observations about the brain scan
   - Note any abnormalities or normal features
   - Include relevant anatomical observations

2. Medical Assessment:
   - Current condition and severity
   - Whether immediate medical attention is required
   - Specific concerns or reassuring findings

3. Recommendations:
   - Immediate actions required (if any)
   - Follow-up schedule
   - Additional imaging requirements (if any)
   - Specialist consultation needs

4. Health Management Plan:
   - Monitoring requirements
   - Lifestyle considerations
   - Support system recommendations
   - Emergency care instructions

5. Important Notes:
   - Warning signs to watch for
   - When to seek emergency care
   - Follow-up care instructions

Please maintain a professional, caring tone while being direct and clear about the medical implications."""
        
        elif disease == "Alzheimer":
            prompt = f"""As a neurologist specializing in cognitive disorders, provide a professional medical assessment for the following case:

Patient's Condition: Alzheimer's Disease Assessment
Assessment: {prediction_class}
Confidence Level: {confidence:.2%}

Please provide a structured medical assessment in the following format:

1. Key Findings:
   - List 3-4 specific observations about cognitive function
   - Note any memory or behavioral patterns
   - Include relevant cognitive assessment results

2. Medical Assessment:
   - Current condition and severity
   - Whether immediate medical attention is required
   - Specific concerns or reassuring findings

3. Recommendations:
   - Immediate actions required (if any)
   - Follow-up schedule
   - Specialist consultation needs
   - Support system recommendations

4. Health Management Plan:
   - Cognitive exercises and activities
   - Safety measures
   - Caregiver support recommendations
   - Emergency care instructions

5. Important Notes:
   - Warning signs to watch for
   - When to seek emergency care
   - Follow-up care instructions

Please maintain a professional, caring tone while being direct and clear about the medical implications."""
        
        elif disease == "Diabetic Retinopathy":
            prompt = f"""As an ophthalmologist specializing in retinal diseases, provide a professional medical assessment for the following case:

Patient's Condition: Diabetic Retinopathy Assessment
Assessment: {prediction_class}
Confidence Level: {confidence:.2%}

Please provide a structured medical assessment in the following format:

1. Key Findings:
   - List 3-4 specific observations about retinal health
   - Note any vascular changes or abnormalities
   - Include relevant retinal features

2. Medical Assessment:
   - Current condition and severity
   - Whether immediate medical attention is required
   - Specific concerns or reassuring findings

3. Recommendations:
   - Immediate actions required (if any)
   - Follow-up schedule
   - Treatment requirements (if any)
   - Specialist consultation needs

4. Health Management Plan:
   - Blood sugar management
   - Eye care recommendations
   - Lifestyle modifications
   - Emergency care instructions

5. Important Notes:
   - Warning signs to watch for
   - When to seek emergency care
   - Follow-up care instructions

Please maintain a professional, caring tone while being direct and clear about the medical implications."""
    
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"I apologize, but I'm unable to provide a medical consultation at this time. Please seek immediate medical attention from a healthcare professional."