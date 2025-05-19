import React from 'react';

export interface HeroTaskPreviewProps {
  title: string;
  steps: { name: string }[];
}

export function HeroTaskPreview({ title, steps }: HeroTaskPreviewProps) {
  return (
    <div className="bg-white/90 rounded-2xl shadow-2xl p-8 border border-gray-100 w-full flex flex-col items-start">
      <div className="font-bold text-lg text-blue-700 mb-4">{title}</div>
      <ul className="w-full flex flex-col gap-2">
        {steps.map((step, i) => (
          <li key={i} className="flex items-center gap-3 bg-white/60 rounded-xl px-4 py-2 shadow border border-blue-100">
            <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">{i + 1}</span>
            <span className="font-semibold text-gray-800">{step.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
} 