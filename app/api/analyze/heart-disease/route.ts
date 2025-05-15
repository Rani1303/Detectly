import { NextResponse } from "next/server";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const systemPrompt = `You are a board-certified cardiologist specializing in early detection and prevention of cardiovascular disease. Your expertise focuses on identifying subtle early indicators including:

- Early ECG pattern changes and variations
- Subtle ST-segment and T-wave abnormalities
- Initial signs of coronary insufficiency
- Early markers of cardiovascular risk
- Borderline or trending vital signs
- Emerging patterns in cardiac biomarkers
- Subtle exercise tolerance changes
- Early diastolic dysfunction indicators
- Initial signs of arterial stiffness
- Pre-clinical atherosclerotic changes

Provide detailed risk assessments with particular attention to subtle changes that may indicate early-stage cardiovascular disease. Consider age, gender, and risk-factor appropriate analysis, highlighting findings that warrant closer monitoring or preventive intervention. Include specific recommendations for lifestyle modifications, follow-up testing, and monitoring intervals based on risk stratification.`;

const classificationPrompt = `You are an AI trained to convert medical analysis text into structured predictions. Given a cardiologist's analysis of patient data, output ONLY a raw JSON object with two fields:
- confidence: A number between 0 and 1 representing the confidence in the prediction
- prediction_class: One of "Very High Risk", "High Risk", "Moderate Risk", "Low Risk", or "Very Low Risk" based on the analysis

IMPORTANT: Return ONLY the raw JSON object without any markdown formatting, code blocks, or additional text. Example format:
{"confidence": 0.95, "prediction_class": "Low Risk"}

Base these values on the certainty of language used and the severity of cardiovascular risk factors in the analysis.`;

export async function POST(request: Request) {
    try {
        const data = await request.json();

        // First call - Get detailed analysis
        const analysisResponse = await fetch(GROQ_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
            },
            body: JSON.stringify({
                messages: [
                    {
                        role: "system",
                        content: systemPrompt
                    },
                    {
                        role: "user",
                        content: `Please analyze the following patient data for heart disease risk:
              - Age: ${data.age}
              - Sex: ${data.sex === "1" ? "Male" : "Female"}
              - Chest Pain Type: ${data.cp}
              - Resting Blood Pressure: ${data.trtbps} mm Hg
              - Cholesterol: ${data.chol} mg/dl
              - Resting ECG: ${data.restecg}
              - Max Heart Rate: ${data.thalachh}
              - Exercise Induced Angina: ${data.exng === "1" ? "Yes" : "No"}
              - ST Depression: ${data.oldpeak}
              - Slope of Peak Exercise ST: ${data.slp}
              - Number of Major Vessels: ${data.caa}
              - Thalassemia: ${data.thall}
              - O2 Saturation: ${data.o2Saturation}%

              Provide a comprehensive risk assessment including specific concerns and recommendations.`
                    }
                ],
                model: "meta-llama/llama-4-scout-17b-16e-instruct",
                temperature: 0.7,
                max_tokens: 1000,
                top_p: 1,
                stream: false
            })
        });

        const analysisResult = await analysisResponse.json();
        const analysis = analysisResult.choices[0].message.content;

        // Second call - Get structured prediction
        const predictionResponse = await fetch(GROQ_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
            },
            body: JSON.stringify({
                messages: [
                    {
                        role: "system",
                        content: classificationPrompt
                    },
                    {
                        role: "user",
                        content: analysis
                    }
                ],
                model: "llama-3.3-70b-versatile",
                temperature: 0.3,
                max_tokens: 100,
                top_p: 1,
                stream: false
            })
        });

        const predictionResult = await predictionResponse.json();
        let prediction;
        try {
            // Try to parse the content directly
            prediction = JSON.parse(predictionResult.choices[0].message.content);
        } catch (e) {
            // If direct parsing fails, try to clean the content first
            const content = predictionResult.choices[0].message.content;
            const cleanContent = content
                .replace(/```json\n?/g, '')  // Remove ```json
                .replace(/```\n?/g, '')      // Remove closing ```
                .trim();                     // Remove extra whitespace

            try {
                prediction = JSON.parse(cleanContent);
            } catch (e) {
                console.error("Failed to parse prediction JSON:", content);
                // Calculate risk score based on key factors as fallback
                const riskFactors = {
                    age: parseInt(data.age) > 55 ? 1 : 0,
                    bp: parseInt(data.trtbps) > 140 ? 1 : 0,
                    chol: parseInt(data.chol) > 200 ? 1 : 0,
                    angina: data.exng === "1" ? 1 : 0,
                    vessels: parseInt(data.caa) > 0 ? 1 : 0
                };

                const riskScore = Object.values(riskFactors).reduce((a, b) => a + b, 0) / 5;
                prediction = {
                    confidence: riskScore,
                    prediction_class: riskScore > 0.7 ? "Very High Risk" :
                        riskScore > 0.5 ? "High Risk" :
                            riskScore > 0.3 ? "Moderate Risk" :
                                riskScore > 0.1 ? "Low Risk" : "Very Low Risk"
                };
            }
        }

        return NextResponse.json({
            analysis,
            confidence: prediction.confidence,
            prediction_class: prediction.prediction_class
        });
    } catch (error) {
        console.error("Error analyzing data:", error);
        return NextResponse.json(
            { error: "Error analyzing data" },
            { status: 500 }
        );
    }
} 