import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

// Validate required environment variables
const requiredEnvVars = [
    'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_ACCESS_KEY',
    'AWS_REGION',
    'AWS_S3_BUCKET'
] as const;

for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
    }
}

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 }
            );
        }

        // Convert file to buffer
        const buffer = Buffer.from(await file.arrayBuffer());

        // Generate unique filename
        const timestamp = Date.now();
        const filename = `${timestamp}-${file.name}`;

        // Upload to S3
        const command = new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET!,
            Key: filename,
            Body: buffer,
            ContentType: file.type,
        });

        try {
            await s3Client.send(command);
        } catch (error: any) {
            console.error("S3 upload error:", error.message);
            return NextResponse.json(
                { error: "Failed to upload to S3", details: error.message },
                { status: 500 }
            );
        }

        // Generate S3 URL
        const fileUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`;

        return NextResponse.json({ success: true, url: fileUrl });
    } catch (error) {
        console.error("Error uploading file:", error);
        return NextResponse.json(
            { error: "Error uploading file" },
            { status: 500 }
        );
    }
} 