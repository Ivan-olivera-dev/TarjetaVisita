import React from 'react';
import { cn } from '../../lib/utils';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export interface BorderBeamProps {
  className?: string;
  size?: number;
  duration?: number;
  borderWidth?: number;
  colorFrom?: string;
  colorTo?: string;
}

/**
 * Cross-browser Bulletproof BorderBeam (Magic UI / 21st.dev)
 * Uses SVG perimeter path animation to guarantee 100% compatibility across
 * iOS Safari, Android Chrome, and desktop without mask-composite glitches.
 */
export const BorderBeam: React.FC<BorderBeamProps> = ({
  className,
  duration = 10,
  borderWidth = 1.5,
  colorFrom = '#10b981',
  colorTo = '#059669',
}) => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden',
        className
      )}
    >
      <svg
        className="absolute inset-0 h-full w-full rounded-[inherit]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="border-beam-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colorFrom} stopOpacity="0.8" />
            <stop offset="50%" stopColor={colorTo} stopOpacity="0.3" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect
          x={borderWidth / 2}
          y={borderWidth / 2}
          width={`calc(100% - ${borderWidth}px)`}
          height={`calc(100% - ${borderWidth}px)`}
          rx="16"
          fill="none"
          stroke="url(#border-beam-grad)"
          strokeWidth={borderWidth}
          strokeDasharray="120 300"
          className="animate-border-beam-svg"
          style={{
            animationDuration: `${duration}s`,
          }}
        />
      </svg>
    </div>
  );
};
