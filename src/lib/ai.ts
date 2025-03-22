import { generateResponse as serverGenerateResponse, type GenerateResponseOptions } from './actions';

export type { GenerateResponseOptions };

function validateOptions(options: GenerateResponseOptions): string | null {
    if (options.temperature !== undefined && (options.temperature < 0 || options.temperature > 1)) {
        return 'Temperature must be between 0 and 1';
    }

    if (options.maxTokens !== undefined && options.maxTokens < 1) {
        return 'Max tokens must be greater than 0';
    }

    if (options.topP !== undefined && (options.topP < 0 || options.topP > 1)) {
        return 'Top P must be between 0 and 1';
    }

    if (options.topK !== undefined && (options.topK < 1 || options.topK > 40)) {
        return 'Top K must be between 1 and 40';
    }

    return null;
}

export async function generateResponse(
    prompt: string,
    schema?: Record<string, any>,
    options: GenerateResponseOptions = {}
): Promise<string> {
    // Validate options on the client side first
    console.log(prompt);
    const validationError = validateOptions(options);
    if (validationError) {
        return JSON.stringify({ error: validationError });
    }
    console.log("yo yo");
    // Call the server action
    return serverGenerateResponse(prompt, schema, options);
}

export { validateOptions }; 