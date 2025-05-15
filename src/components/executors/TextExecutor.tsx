import React from 'react';
import { TextComponent } from '../../types/component_schema';
import { useRecords } from '../../contexts/RecordsContext';
import { interpolateText } from '../../lib/helpers';

interface TextExecutorProps {
    component: TextComponent;
}

export const TextExecutor: React.FC<TextExecutorProps> = ({ component }) => {
    const { getRecords } = useRecords();
    const interpolatedText = interpolateText(component.text, getRecords);

    return (
        <div className="relative pt-6">
            {/* Background gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-lg -z-20"></div>
            
            {/* Glassy background with extended height */}
            <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] rounded-lg -z-10 h-[calc(100%+2rem)] shadow-lg"></div>
            
            <div className="relative px-6 pb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-3">{component.name}</h3>
                <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{interpolatedText}</p>
                </div>
            </div>
        </div>
    );
}; 