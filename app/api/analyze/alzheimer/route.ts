import { NextResponse } from "next/server";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const systemPrompt = `You are a board-certified neuroradiologist specializing in early detection of neurodegenerative diseases, particularly Alzheimer's disease through MRI analysis. Your expertise focuses on identifying subtle early indicators including:

- Early hippocampal volume changes and asymmetry
- Subtle medial temporal lobe atrophy (MTA score assessment)
- Initial entorhinal cortex thinning
- Early-stage white matter changes
- Preclinical ventricular enlargement patterns
- Emerging cortical atrophy patterns
- Regional brain volume changes compared to age-matched controls

Provide detailed assessments with particular attention to subtle changes that may indicate early-stage neurodegeneration. Consider age-appropriate changes vs. pathological changes, and highlight any findings that warrant further investigation or monitoring. Include recommendations for follow-up imaging if appropriate.`;

const classificationPrompt = `You are an AI trained to convert medical analysis text into structured predictions. Given a neuroradiologist's analysis of a brain MRI scan, output ONLY a raw JSON object with two fields:
- confidence: A number between 0 and 1 representing the confidence in the prediction
- prediction_class: Either "Dementia" or "Non Dementia" based on the analysis

IMPORTANT: Return ONLY the raw JSON object without any markdown formatting, code blocks, or additional text. Example format:
{"confidence": 0.95, "prediction_class": "Non Dementia"}

Base these values on the certainty of language used and the presence/absence of Alzheimer's indicators in the analysis.`;

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
                                text: "Please analyze this brain MRI scan for signs of Alzheimer's disease. Provide a detailed assessment of any atrophy, ventricular changes, cortical thinning, or other relevant findings. Include your diagnostic impression and disease stage if applicable."
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
                    prediction_class: "Non Dementia"
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