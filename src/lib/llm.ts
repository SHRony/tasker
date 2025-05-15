"use server"

import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

/**
 * Base interface for LLM providers
 */
export interface AIProviderInterface {
    generateResponse(prompt: string): Promise<string>;
}

/**
 * Gemini-specific provider implementation
 */
class GeminiProvider implements AIProviderInterface {
    private model: GenerativeModel;

    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY is not set in environment variables');
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        this.model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash",
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024,
            }
        });
    }

    async generateResponse(prompt: string): Promise<string> {
        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('Gemini API Error:', error);
            return "Error"; 
            // throw new Error(`Failed to generate response: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}

// Create a singleton instance
const provider = new GeminiProvider();

// Export only the async function
export async function generateGeminiResponse(prompt: string): Promise<string> {
    return provider.generateResponse(prompt);
} 