declare namespace NodeJS {
    interface ProcessEnv {
        GROQ_API_KEY: string;
        AWS_REGION: string;
        AWS_ACCESS_KEY_ID: string;
        AWS_SECRET_ACCESS_KEY: string;
        AWS_S3_BUCKET: string;
    }
}

