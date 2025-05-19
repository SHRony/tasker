import React from 'react';

export interface HeroStepPreviewProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  type?: string;
  index?: number;
}

export function HeroStepPreview({ icon, title, desc, type, index }: HeroStepPreviewProps) {
  return (
    <div key={index} className="bg-white/30 backdrop-blur-lg border border-white/40 shadow-2xl p-8 rounded-2xl flex flex-col items-start w-full absolute left-0 right-0 mx-auto"
                                            style={{ pointerEvents: 'auto' }}>
      <div className="flex items-center space-x-3 mb-2">
        <span className="text-2xl">{icon}</span>
        <span className="font-semibold text-lg">{title}</span>
      </div>
      <div className="text-gray-700 mb-1">{desc}</div>
      {type && <div className="text-xs text-gray-500">Type: {type}</div>}
    </div>
  );
} 