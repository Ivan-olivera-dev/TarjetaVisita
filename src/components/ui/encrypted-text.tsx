import { useCallback, useEffect, useRef, useState, type ReactElement } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { cn } from '../../lib/utils';

const CHARS = '!@#$%^&*():{};|,.<>/?';

export interface EncryptedTextProps {
  text: string;
  interval?: number;
  duration?: number;
  className?: string;
}

export function EncryptedText({
  text,
  interval = 50,
  duration = 1500,
  className = '',
}: EncryptedTextProps): ReactElement {
  const prefersReducedMotion = useReducedMotion();
  const [displayText, setDisplayText] = useState<string>(text);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const scramble = useCallback(
    (targetText: string) => {
      clearTimers();

      if (prefersReducedMotion || !targetText || duration <= 0 || interval <= 0) {
        setDisplayText(targetText);
        return;
      }

      let pos = 0;
      const totalTicks = Math.max(duration / interval, 1);
      const step = Math.max(targetText.length / totalTicks, 0.25);

      intervalRef.current = setInterval(() => {
        if (pos >= targetText.length) {
          clearTimers();
          setDisplayText(targetText);
          return;
        }

        const nextText = targetText
          .split('')
          .map((char, index) => {
            if (index < pos) {
              return targetText[index];
            }
            if (char === ' ') {
              return ' ';
            }
            return CHARS[Math.floor(Math.random() * CHARS.length)] ?? char;
          })
          .join('');

        setDisplayText(nextText);
        pos += step;
      }, interval);
    },
    [clearTimers, duration, interval, prefersReducedMotion]
  );

  useEffect(() => {
    setDisplayText(text);
    if (!prefersReducedMotion) {
      scramble(text);
    }
    return () => {
      clearTimers();
    };
  }, [text, prefersReducedMotion, scramble, clearTimers]);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current !== null) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
    };
  }, []);

  const isScrambling = !prefersReducedMotion && displayText !== text;

  return (
    <motion.span
      data-scrambling={isScrambling ? 'true' : 'false'}
      onMouseEnter={() => {
        if (!prefersReducedMotion && !isHovering) {
          setIsHovering(true);
          scramble(text);
          if (hoverTimeoutRef.current !== null) {
            clearTimeout(hoverTimeoutRef.current);
          }
          hoverTimeoutRef.current = setTimeout(() => {
            setIsHovering(false);
          }, duration);
        }
      }}
      className={cn('inline-block cursor-default', className)}
    >
      {isScrambling ? (
        <>
          <span className="sr-only">{text}</span>
          <span aria-hidden="true">{displayText}</span>
        </>
      ) : (
        text
      )}
    </motion.span>
  );
}

export default EncryptedText;
