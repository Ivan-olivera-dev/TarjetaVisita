import { useEffect, useState } from 'react';

export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

export function getInitialReducedMotion(): boolean {
  try {
    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      return Boolean(window.matchMedia(REDUCED_MOTION_QUERY)?.matches);
    }
  } catch {
    return false;
  }
  return false;
}

export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(() =>
    getInitialReducedMotion()
  );

  useEffect(() => {
    try {
      if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
        return;
      }
      const mediaQueryList = window.matchMedia(REDUCED_MOTION_QUERY);
      if (!mediaQueryList) {
        return;
      }

      setPrefersReducedMotion(Boolean(mediaQueryList.matches));

      const handleChange = (event: MediaQueryListEvent) => {
        setPrefersReducedMotion(Boolean(event.matches));
      };

      if (typeof mediaQueryList.addEventListener === 'function') {
        mediaQueryList.addEventListener('change', handleChange);
        return () => {
          mediaQueryList.removeEventListener('change', handleChange);
        };
      } else if (typeof mediaQueryList.addListener === 'function') {
        mediaQueryList.addListener(handleChange);
        return () => {
          mediaQueryList.removeListener(handleChange);
        };
      }
    } catch {
      // Degradación segura si matchMedia falla
    }
    return undefined;
  }, []);

  return prefersReducedMotion;
}
