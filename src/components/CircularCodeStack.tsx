import React from 'react';
import { motion } from 'framer-motion';

// CodeEditorCard: A code block with a fake editor header
export function CodeEditorCard({ code, filename, style = {}, className = '' }: {
  code: string;
  filename?: string;
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl shadow-2xl bg-white/60 backdrop-blur-md border border-[#232b3b] overflow-hidden min-w-[320px] max-w-[380px] ${className}`}
      style={style}
    >
      {/* Editor header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#232b3b] border-b border-[#232b3b]">
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-red-400 inline-block" />
          <span className="w-3 h-3 rounded-full bg-yellow-300 inline-block" />
          <span className="w-3 h-3 rounded-full bg-green-400 inline-block" />
        </div>
        <span className="text-xs text-gray-400 font-mono">{filename || 'main.cpp'}</span>
      </div>
      {/* Code block */}
      <pre className="p-4 text-sm font-mono text-gray-900 font-medium whitespace-pre overflow-x-auto bg-transparent !overflow-hidden">
        {code}
      </pre>
    </div>
  );
}

// CircularCodeStack: Arranges cards in a circular, fanned-out stack
export function CircularCodeStack({
  snippets,
  visibleCount = 3,
  radius = 150,
  center = { x: 0, y: 0 },
}: {
  snippets: { code: string; filename?: string }[];
  visibleCount?: number;
  radius?: number;
  center?: { x: number; y: number };
}) {
  // Only show a portion of the circle (fan effect)
  const angleStep = Math.PI / (visibleCount - 1);
  const startAngle = -Math.PI / 2 - angleStep * (visibleCount - 1) / 2;

  return (
    <div className="relative flex items-center justify-center" style={{ width: radius * 2.2, height: radius * 1.5 }}>
      {snippets.slice(0, 3).map((snippet, i) => {
        const angle = startAngle + i * angleStep;
        const x = center.x + radius * Math.cos(angle);
        const y = center.y + radius * Math.sin(angle);
        return (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              left: `calc(50% + ${x}px - 50%)`,
              top: `calc(55% + ${y}px - 50%)`,
              zIndex: 0,
              opacity: 0.35,
              scale: 0.85,
              filter: 'blur(6px)',
              pointerEvents: 'none',
              transition: 'all 0.5s cubic-bezier(.4,2,.6,1)',
            }}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 0.35, scale: 0.85 }}
            transition={{ duration: 0.7, delay: i * 0.08 }}
          >
            <CodeEditorCard {...snippet} />
          </motion.div>
        );
      })}
    </div>
  );
} 