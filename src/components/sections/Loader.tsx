import { useEffect, useRef, useState, type ReactElement } from 'react';
import { motion } from 'framer-motion';
import { getInitialReducedMotion, useReducedMotion } from '../../hooks/useReducedMotion';
import { EncryptedText } from '../ui/encrypted-text';

export const LOADER_SESSION_KEY = 'io_card_loaded_session';
export const LEGACY_LOADER_SESSION_KEY = 'io_card_loader_seen';
export const LOADER_DURATION_MS = 1400;

export const LOADER_MESSAGES = [
  'Initializing System...',
  'Decrypting modules...',
  'Access Granted.',
] as const;

export type LoaderMessage = (typeof LOADER_MESSAGES)[number];

export interface LoaderStep {
  readonly text: LoaderMessage;
  readonly delayMs: number;
}

export const LOADER_SEQUENCE: readonly LoaderStep[] = [
  { text: 'Initializing System...', delayMs: 0 },
  { text: 'Decrypting modules...', delayMs: 500 },
  { text: 'Access Granted.', delayMs: 1000 },
] as const;

let memoryLoaderSessionLoaded = false;

export function resetLoaderMemoryFallback(): void {
  memoryLoaderSessionLoaded = false;
}

export function isLoaderSessionComplete(): boolean {
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const hasSessionFlag =
        window.sessionStorage.getItem(LOADER_SESSION_KEY) === '1' ||
        window.sessionStorage.getItem(LEGACY_LOADER_SESSION_KEY) === '1';
      memoryLoaderSessionLoaded = hasSessionFlag;
      return hasSessionFlag;
    }
  } catch {
    return memoryLoaderSessionLoaded;
  }
  return memoryLoaderSessionLoaded;
}

export function markLoaderSessionComplete(): void {
  memoryLoaderSessionLoaded = true;
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      window.sessionStorage.setItem(LOADER_SESSION_KEY, '1');
      window.sessionStorage.setItem(LEGACY_LOADER_SESSION_KEY, '1');
    }
  } catch {
    // Degradación silenciosa en memoria cuando sessionStorage está bloqueado (Spec 4.1)
  }
}

export function shouldSkipLoader(
  prefersReducedMotion: boolean = getInitialReducedMotion()
): boolean {
  if (prefersReducedMotion) {
    return true;
  }
  return isLoaderSessionComplete();
}

export function shouldShowLoader(
  prefersReducedMotion: boolean = getInitialReducedMotion()
): boolean {
  return !shouldSkipLoader(prefersReducedMotion);
}

export interface LoaderProps {
  onComplete?: () => void;
  setLoading?: (loading: boolean) => void;
}

export function Loader({ onComplete, setLoading }: LoaderProps): ReactElement | null {
  const prefersReducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState<boolean>(
    () => !shouldSkipLoader(prefersReducedMotion)
  );
  const [currentText, setCurrentText] = useState<LoaderMessage>(LOADER_MESSAGES[0]);
  const completedRef = useRef<boolean>(false);

  useEffect(() => {
    const notifyComplete = () => {
      if (completedRef.current) return;
      completedRef.current = true;
      setIsVisible(false);
      setLoading?.(false);
      onComplete?.();
    };

    if (shouldSkipLoader(prefersReducedMotion)) {
      notifyComplete();
      return undefined;
    }

    const stepTimers = LOADER_SEQUENCE.slice(1).map((step) =>
      setTimeout(() => {
        setCurrentText(step.text);
      }, step.delayMs)
    );

    const finishTimer = setTimeout(() => {
      markLoaderSessionComplete();
      notifyComplete();
    }, LOADER_DURATION_MS);

    return () => {
      stepTimers.forEach((timerId) => clearTimeout(timerId));
      clearTimeout(finishTimer);
    };
  }, [prefersReducedMotion, onComplete, setLoading]);

  if (!isVisible || prefersReducedMotion) {
    return null;
  }

  return (
    <motion.div
      data-testid="system-loader"
      role="status"
      aria-live="polite"
      aria-label="System initialization sequence"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.35 } }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black px-6"
    >
      <div className="relative mb-8 h-1 w-64 max-w-full overflow-hidden rounded-full bg-neutral-900">
        <motion.div
          data-testid="loader-progress-bar"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: LOADER_DURATION_MS / 1000, ease: 'easeInOut' }}
          className="absolute left-0 top-0 h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
        />
      </div>
      <div className="font-mono text-sm tracking-wider text-emerald-400">
        <EncryptedText text={currentText} duration={320} interval={25} />
      </div>
    </motion.div>
  );
}

export default Loader;
