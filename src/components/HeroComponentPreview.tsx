import React from 'react';

export interface HeroComponentPreviewProps {
  icon: React.ReactNode;
  name: string;
  desc: string;
  className:string;
}

export function HeroComponentPreview({ icon, name, desc, className }: HeroComponentPreviewProps) {
  return (
    <div className={`flex flex-col bg-transparent rounded-xl shadow-sm gap-2 p-8 ${className}`}>
        <div className="flex justify-start gap-2 flex-row">
          <span className="text-xl mr-2">{icon}</span>
          <div className="font-bold text-gray-900 leading-tight text-2xl">{name}</div>
        </div>
        <div className="text-xs text-gray-500 leading-tight text-clip line-clamp-1">{desc}</div>
    </div>
  );
} 