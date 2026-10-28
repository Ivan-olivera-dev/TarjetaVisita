import React, { useRef, useState, useCallback } from 'react';
import { cn } from '../../lib/utils';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export interface SpotlightProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  fill?: string;
  size?: number;
  children?: React.ReactNode;
}

/**
 * Spotlight component (Magic UI / 21st.dev)
 * Interactive radial glow tracking mouse / touch coordinates to simulate high-end physical lighting.
 */
export const Spotlight: React.FC<SpotlightProps> = ({
  className,
  fill = 'rgba(16, 185, 129, 0.15)',
  size = 350,
  children,
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ x: number; y: number; opacity: number }>({
    x: 0,
    y: 0,
    opacity: 0,
  });
  const prefersReducedMotion = useReducedMotion();

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (prefersReducedMotion || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        opacity: 1,
      });
    },
    [prefersReducedMotion],
  );

  const handlePointerLeave = useCallback(() => {
    setPosition((prev) => ({ ...prev, opacity: 0 }));
  }, []);

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={cn('relative overflow-hidden', className)}
      {...props}
    >
      {!prefersReducedMotion && (
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300"
          style={{
            opacity: position.opacity,
            background: `radial-gradient(${size}px circle at ${position.x}px ${position.y}px, ${fill}, transparent 80%)`,
          }}
          aria-hidden="true"
        />
      )}
      {children}
    </div>
  );
};
