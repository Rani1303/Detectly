import { NextResponse } from "next/server";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const systemPrompt = `You are a board-certified ophthalmologist specializing in early detection of diabetic retinopathy with expertise in subtle retinal changes. Your focus is on identifying early-stage indicators including:

- Isolated microaneurysms (first clinical sign)
- Subtle dot and blot hemorrhages
- Early formation of hard exudates
- Initial cotton wool spots
- Beginning stages of venous caliber changes
- Early macular changes
- Subtle alterations in retinal vessel patterns
- Initial signs of retinal ischemia
- Early peripheral retinal changes
- Comparison with normal vascular variations

Provide detailed assessments with emphasis on early detection and subtle changes that may indicate disease onset. Consider both typical and atypical early presentation patterns, and highlight findings that require close monitoring or prompt follow-up. Include specific recommendations for screening intervals and additional testing if warranted.`;

const classificationPrompt = `You are an AI trained to convert medical analysis text into structured predictions. Given an ophthalmologist's analysis of a retinal image, output ONLY a raw JSON object with two fields:
- confidence: A number between 0 and 1 representing the confidence in the prediction
- prediction_class: One of "No DR", "Mild DR", "Moderate DR", "Severe DR", or "Proliferative DR" based on the analysis

IMPORTANT: Return ONLY the raw JSON object without any markdown formatting, code blocks, or additional text. Example format:
{"confidence": 0.95, "prediction_class": "No DR"}

Base these values on the certainty of language used and the severity of diabetic retinopathy indicators in the analysis.`;

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
                                text: "Please analyze this retinal image for signs of diabetic retinopathy. Provide a detailed assessment of any microaneurysms, hemorrhages, exudates, or other abnormalities. Include your diagnostic impression and disease severity classification."
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
                    prediction_class: "No DR"
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