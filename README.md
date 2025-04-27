# Detectly - Medical Image Analysis API

Detectly is a FastAPI-based medical image analysis service that provides automated detection and analysis of various medical conditions using machine learning models. The service currently supports detection of Alzheimer's disease, Brain Tumors, Diabetic Retinopathy, and Heart Disease risk assessment.

## Features

- **Multiple Disease Detection**: Support for various medical conditions
  - Alzheimer's Disease
  - Brain Tumors
  - Diabetic Retinopathy
  - Heart Disease Risk Assessment
- **AI-Powered Analysis**: Utilizes machine learning models for accurate detection
- **Medical Consultation**: Includes AI-generated medical explanations and recommendations
- **RESTful API**: Easy integration with other applications
- **Fast and Efficient**: Built with FastAPI for high performance

## Prerequisites

- Python 3.8+
- pip (Python package manager)
- Virtual environment (recommended)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/detectly.git
cd detectly
```

2. Create and activate a virtual environment:
```bash
python -m venv env
# On Windows
env\Scripts\activate
# On Unix or MacOS
source env/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
Create a `.env` file in the root directory with the following content:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

## API Endpoints

### 1. Alzheimer's Disease Detection
```http
POST /detect/alzheimer
```
- **Input**: MRI image file
- **Response**: 
  ```json
  {
    "disease": "Alzheimer",
    "prediction_class": "Non Dementia" | "Very Mild Dementia" | "Mild Dementia" | "Moderate Dementia",
    "confidence": 0.95,
    "explanation": "Detailed medical explanation..."
  }
  ```

### 2. Brain Tumor Detection
```http
POST /detect/brain_tumor
```
- **Input**: MRI image file
- **Response**:
  ```json
  {
    "disease": "Brain Tumor",
    "prediction_class": "No Tumor" | "Tumor Present",
    "confidence": 0.95,
    "explanation": "Detailed medical explanation..."
  }
  ```

### 3. Diabetic Retinopathy Detection
```http
POST /detect/diabetic_retinopathy
```
- **Input**: Retina image file
- **Response**:
  ```json
  {
    "disease": "Diabetic Retinopathy",
    "prediction_class": "No Diabetic Retinopathy" | "Mild Diabetic Retinopathy" | "Moderate Diabetic Retinopathy" | "Proliferative Diabetic Retinopathy" | "Severe Diabetic Retinopathy",
    "confidence": 0.95,
    "explanation": "Detailed medical explanation..."
  }
  ```

### 4. Heart Disease Risk Assessment
```http
POST /detect/heart-disease
```
- **Input**: JSON with patient data
  ```json
  {
    "age": 45,
    "sex": 1,
    "cp": 0,
    "trtbps": 120,
    "chol": 200,
    "restecg": 0,
    "thalachh": 150,
    "exng": 0,
    "oldpeak": 1.2,
    "slp": 1,
    "caa": 0,
    "thall": 1,
    "o2Saturation": 98.5
  }
  ```
- **Response**:
  ```json
  {
    "disease": "Heart Disease",
    "confidence": 0.75,
    "explanation": "Detailed medical explanation..."
  }
  ```

## Usage Examples

### Python Example
```python
import requests

# Alzheimer's detection
with open('mri_image.jpg', 'rb') as f:
    response = requests.post(
        'http://localhost:8000/detect/alzheimer',
        files={'file': f}
    )
print(response.json())

# Heart Disease assessment
data = {
    "age": 45,
    "sex": 1,
    "cp": 0,
    "trtbps": 120,
    "chol": 200,
    "restecg": 0,
    "thalachh": 150,
    "exng": 0,
    "oldpeak": 1.2,
    "slp": 1,
    "caa": 0,
    "thall": 1,
    "o2Saturation": 98.5
}
response = requests.post(
    'http://localhost:8000/detect/heart-disease',
    json=data
)
print(response.json())
```

### cURL Example
```bash
# Alzheimer's detection
curl -X POST -F "file=@mri_image.jpg" http://localhost:8000/detect/alzheimer

# Heart Disease assessment
curl -X POST -H "Content-Type: application/json" \
     -d '{"age":45,"sex":1,"cp":0,"trtbps":120,"chol":200,"restecg":0,"thalachh":150,"exng":0,"oldpeak":1.2,"slp":1,"caa":0,"thall":1,"o2Saturation":98.5}' \
     http://localhost:8000/detect/heart-disease
```

## Running the Server

1. Start the FastAPI server:
```bash
uvicorn main:app --reload
```

2. Access the API documentation at:
```
http://localhost:8000/docs
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:
- 400: Bad Request (invalid input)
- 500: Internal Server Error

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

This application is for educational and research purposes only. It should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
