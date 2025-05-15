import React, { useState } from 'react';
import { TextInputComponent } from '../../types/component_schema';

interface TextInputExecutorProps {
    component: TextInputComponent;
    putRecord: (key: string, value: string) => void;
    setReady: (ready: boolean) => void;
}

export const TextInputExecutor: React.FC<TextInputExecutorProps> = ({ component, putRecord, setReady }) => {
    const [value, setValue] = useState('');
    const [focused, setFocused] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setValue(newValue);
        putRecord(component.id, newValue);
        setReady(component.required ? newValue.length > 0 : true);
    };

    return (
        <div className="relative pt-6">
            {/* Background gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-lg -z-20"></div>
            
            {/* Glassy background with extended height */}
            <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] rounded-lg -z-10 h-[calc(100%+2rem)] shadow-lg"></div>
            
            <div className="relative px-6 pb-6">
                <label
                    className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
                        focused ? 'text-blue-600' : 'text-gray-700'
                    }`}
                >
                    {component.name}
                </label>
                <div className={`relative transition-all duration-200 ${focused ? 'scale-[1.01]' : ''}`}>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-md blur-sm -z-10"></div>
                    <input
                        type="text"
                        value={value}
                        onChange={handleChange}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        placeholder={component.placeholder}
                        className="w-full p-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:outline-none transition-all duration-200"
                        required={component.required}
                    />
                </div>
                {component.required && (
                    <div className="text-xs mt-2 text-gray-500 flex items-center">
                        <span className={`${value ? 'text-green-500' : 'text-gray-400'}`}>
                            {value ? '✓ Required field filled' : '● Required field'}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}; 