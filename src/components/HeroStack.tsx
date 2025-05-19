import React, { ReactNode, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeroStackProps {
  children: ReactNode[];
  interval?: number; // ms between transitions
  className?: string;
}

export function HeroStack({ children, interval = 3200, className = '' }: HeroStackProps) {
  const [topIdx, setTopIdx] = useState(0);
  const [animating, setAnimating] = useState(false);
  const count = children.length;

  useEffect(() => {
    if (animating) return;
    const timer = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setTopIdx((prev) => (prev + 1) % count);
        setAnimating(false);
      }, 600);
    }, interval);
    return () => clearInterval(timer);
  }, [count, interval, animating]);

  return (
    <div className={`flex-1 flex items-center justify-center ${className} w-fit justify-start`}>
                            {/* Animated stacked cards, as before */}
                            <div className="relative flex items-start justify-start bg-amber-600">
                                <AnimatePresence initial={false}>
                                    {/* Top card (active) */}
                                    <motion.div
                                        key={topIdx}
                                        initial={{ opacity: 0, scale: 0.95, y: 30 }}
                                        animate={{ opacity: 1, scale: 1, y: 0, zIndex: 2 }}
                                        exit={{ opacity: 0, scale: 0.9, y: -30, zIndex: 2 }}
                                        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                                        className="absolute left-0 -translate-y-1/2 mx-auto backdrop-blur-lg border border-white/40 shadow-2xl  rounded-2xl flex flex-col items-start w-fit"
                                        style={{ pointerEvents: 'auto' }}
                                    >
                                        {children[topIdx] as ReactNode}
                                    </motion.div>
                                    {/* Next card (peek) */}
                                    <motion.div
                                        key={topIdx + '-next'}
                                        initial={{ opacity: 0, scale: 0.93, y: 50, zIndex: 1 }}
                                        animate={{ opacity: 0.8, scale: 0.97, y: 18, zIndex: 1 }}
                                        exit={{ opacity: 0, scale: 0.93, y: 50, zIndex: 1 }}
                                        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                                        className="absolute left-0 -translate-y-1/2 mx-auto w-full bg-white/20 backdrop-blur-lg border border-white/30 shadow-xl  rounded-2xl flex flex-col items-start"
                                        style={{ pointerEvents: 'none' }}
                                    >
                                        {children[(topIdx + 1) % count] as ReactNode}
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>
  );
} 