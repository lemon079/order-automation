import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

// Initialize Gemini 2.5 Flash model
export function createModel() {
    return new ChatGoogleGenerativeAI({
        model: 'gemini-2.5-flash-preview-05-20',
        temperature: 0.3,
        apiKey: process.env.GOOGLE_API_KEY,
    });
}
