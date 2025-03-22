'use server'

import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set in environment variables');
}

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export interface GenerateResponseOptions {
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    topK?: number;
}

export async function generateResponse(
    prompt: string,
    schema?: Record<string, any>,
    options: GenerateResponseOptions = {}
): Promise<string> {
    try {
        const model = genAI.getGenerativeModel({ 
            model: 'gemini-1.5-flash',
            generationConfig: {
                temperature: options.temperature ?? 0.7,
                maxOutputTokens: options.maxTokens ?? 2048,
                topP: options.topP ?? 0.8,
                topK: options.topK ?? 40,
            },
        });

        // If schema is provided, create a structured prompt
        const fullPrompt = schema 
            ? `${prompt}\n\nPlease provide your response in the following JSON format:\n${JSON.stringify(schema, null, 2)}`
            : prompt;

        // Generate response
        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text();

        // If schema was provided, try to parse the response as JSON
        if (schema) {
            try {
                // Find the JSON part in the response
                const jsonMatch = text.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    return jsonMatch[0];
                }
                // If no JSON found, wrap the text in a JSON object
                return JSON.stringify({ response: text });
            } catch (parseError) {
                console.error('Failed to parse AI response as JSON:', parseError);
                return JSON.stringify({ response: text });
            }
        }

        return text;
    } catch (error) {
        console.error('AI Generation Error:', error);
        return JSON.stringify({ 
            error: error instanceof Error ? error.message : 'An unknown error occurred' 
        });
    }
} 