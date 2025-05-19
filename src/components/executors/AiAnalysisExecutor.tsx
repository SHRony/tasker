import React, { useState, useEffect, useRef } from 'react';
import { AiAnalysisComponent } from '../../types/component_schema';
import { useRecords } from '../../contexts/RecordsContext';
import { interpolateText } from '../../lib/helpers';
import { generateResponse } from '../../lib/ai';

interface AiAnalysisExecutorProps {
    component: AiAnalysisComponent;
    putRecord: (key: string, value: string) => void;
    setReady: (ready: boolean) => void;
}

export const AiAnalysisExecutor: React.FC<AiAnalysisExecutorProps> = ({
    component,
    putRecord,
    setReady
}) => {
    const { getRecords } = useRecords();
    const [loading, setLoading] = useState(true);
    // const [error, setError] = useState<string | null>(null);
    // const [response, setResponse] = useState<string | null>(null);
    const hasGenerated = useRef(false);

    useEffect(() => {
        if (hasGenerated.current) return;
        hasGenerated.current = true;
        const getResponse = async () => {
            try {
                setLoading(true);
                // setError(null);

                const prompt = interpolateText(component.prompt, getRecords);
                const aiResponse = await generateResponse(prompt);

                // setResponse(aiResponse);
                const currentValue = getRecords(component.id);
                if (currentValue !== aiResponse) {
                    putRecord(component.id, aiResponse);
                }
                setReady(true);
            } catch {
                // setError(err instanceof Error ? err.message : 'An error occurred');
                setReady(false);
            } finally {
                setLoading(false);
            }
        };

        getResponse();
    }, [component, getRecords, putRecord, setReady]);

    // Only show loading state
    if (loading) {
        return (
            <div className="relative pt-6">
                {/* Background gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-lg -z-20"></div>
                
                {/* Glassy background with extended height */}
                <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] rounded-lg -z-10 h-[calc(100%+2rem)] shadow-lg"></div>
                
                <div className="relative px-6 pb-6">
                    <div className="flex items-center justify-center py-8">
                        <div className="flex space-x-2">
                            <div className="w-3 h-3 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-3 h-3 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-3 h-3 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                        <div className="ml-4 text-gray-600">Thinking...</div>
                    </div>
                </div>
            </div>
        );
    }

    // Don't render anything after loading is done
    return null;
}; 