export interface AnalysisResult {
    analysis: string;
    confidence: number;
    prediction_class: string;
}

export interface HeartDiseaseData {
    age: string;
    sex: string;
    cp: string;
    trtbps: string;
    chol: string;
    restecg: string;
    thalachh: string;
    exng: string;
    oldpeak: string;
    slp: string;
    caa: string;
    thall: string;
    o2Saturation: string;
}

export interface ImageAnalysisRequest {
    imageUrl: string;
}

export interface GroqResponse {
    choices: {
        message: {
            content: string;
        };
    }[];
} 