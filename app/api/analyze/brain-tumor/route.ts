import { NextResponse } from "next/server";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const systemPrompt = `You are a highly specialized neuro-oncologist and neuroradiologist with expertise in early detection and screening of brain tumors through MRI analysis. Your focus is on identifying subtle early-stage findings including:

- Small or emerging lesions that may be easily overlooked
- Subtle contrast enhancement patterns
- Early mass effect or minimal midline shift
- Initial peritumoral edema signs
- Discrete changes in normal brain architecture
- Early signs of infiltrative growth patterns
- Subtle signal intensity changes
- Small hemorrhagic components or calcifications
- Early hydrocephalus indicators
- Comparison with normal anatomical variants

Provide comprehensive assessments with particular attention to subtle abnormalities that could indicate early-stage tumors. Consider both typical and atypical presentation patterns, and emphasize findings that require immediate attention or short-term follow-up. Include specific recommendations for additional imaging sequences or follow-up intervals if needed.`;

const classificationPrompt = `You are an AI trained to convert medical analysis text into structured predictions. Given a neuroradiologist's analysis of a brain MRI scan, output ONLY a raw JSON object with two fields:
- confidence: A number between 0 and 1 representing the confidence in the prediction
- prediction_class: One of "Tumor Present", "No Tumor", or "Inconclusive" based on the analysis

IMPORTANT: Return ONLY the raw JSON object without any markdown formatting, code blocks, or additional text. Example format:
{"confidence": 0.95, "prediction_class": "No Tumor"}

Base these values on the certainty of language used and the presence/absence of tumor indicators in the analysis.`;

export async function POST(request: Request) {
    try {
        const { imageUrl } = await request.json();

        if (!imageUrl) {
            return NextResponse.json(
                { error: "No image URL provided" },
                { status: 400 }
            );
        }

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
                        content: [
                            {
                                type: "text",
                                text: "Please analyze this brain MRI scan for the presence of tumors. Provide a detailed assessment of any masses, their characteristics, location, and surrounding tissue involvement. Include your diagnostic impression and any concerning features that require immediate attention."
                            },
                            {
                                type: "image_url",
                                image_url: {
                                    url: imageUrl
                                }
                            }
                        ]
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
                // Fallback to default values
                prediction = {
                    confidence: 0.5,
                    prediction_class: "Inconclusive"
                };
            }
        }

        return NextResponse.json({
            analysis,
            confidence: prediction.confidence,
            prediction_class: prediction.prediction_class
        });
    } catch (error) {
        console.error("Error analyzing image:", error);
        return NextResponse.json(
            { error: "Error analyzing image" },
            { status: 500 }
        );
    }
} 