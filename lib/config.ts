import dotenv from 'dotenv';

dotenv.config();

const requiredEnvKeys = ['GEMINI_API_KEY', 'PINECONE_API_KEY'] as const;
const missingEnvKeys = requiredEnvKeys.filter((key) => {
  const value = process.env[key];
  return value === undefined || value.trim() === '';
});

if (missingEnvKeys.length > 0) {
  throw new Error(`Missing required environment variable(s): ${missingEnvKeys.join(', ')}`);
}

export const config = {
  GEMINI_API_KEY: process.env.GEMINI_API_KEY!,
  PINECONE_API_KEY: process.env.PINECONE_API_KEY!,
  PINECONE_INDEX: "chatpdf", 
};
