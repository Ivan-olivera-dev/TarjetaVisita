import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
  type TouchEvent as ReactTouchEvent,
} from 'react';
import {
  useMotionTemplate,
  useMotionValue,
  useSpring,
  type MotionValue,
} from 'framer-motion';
import { useReducedMotion } from './useReducedMotion';

export const DEFAULT_MAX_TILT_DEG = 12;

export interface TiltBounds {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface TiltCalculation {
  rotateX: number;
  rotateY: number;
  glareX: number;
  glareY: number;
}

export interface TiltState extends TiltCalculation {
  isActive: boolean;
}

export interface UseTilt3DOptions {
  maxTiltDeg?: number;
  disabled?: boolean;
}

export interface UseTilt3DHandlers {
  onPointerEnter: (event: ReactPointerEvent<HTMLElement>) => void;
  onPointerMove: (event: ReactPointerEvent<HTMLElement>) => void;
  onPointerLeave: () => void;
  onMouseMove: (event: ReactMouseEvent<HTMLElement>) => void;
  onMouseLeave: () => void;
  onTouchMove: (event: ReactTouchEvent<HTMLElement>) => void;
  onTouchEnd: () => void;
}

export interface UseTilt3DResult {
  ref: RefObject<HTMLDivElement | null>;
  tilt: TiltState;
  isReducedMotion: boolean;
  rotateXSpring: MotionValue<number>;
  rotateYSpring: MotionValue<number>;
  glareBackground: MotionValue<string>;
  handlers: UseTilt3DHandlers;
  resetTilt: () => void;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function calculateTiltFromPoint(
  clientX: number,
  clientY: number,
  bounds: TiltBounds,
  maxTiltDeg: number = DEFAULT_MAX_TILT_DEG
): TiltCalculation {
  const safeWidth = bounds.width > 0 ? bounds.width : 360;
  const safeHeight = bounds.height > 0 ? bounds.height : 220;

  const relX = clamp((clientX - bounds.left) / safeWidth, 0, 1);
  const relY = clamp((clientY - bounds.top) / safeHeight, 0, 1);

  const offsetX = relX - 0.5;
  const offsetY = relY - 0.5;

  const rotateY = Number((offsetX * 2 * maxTiltDeg).toFixed(2));
  const rotateX = Number((-offsetY * 2 * maxTiltDeg).toFixed(2));
  const glareX = Number((relX * 100).toFixed(1));
  const glareY = Number((relY * 100).toFixed(1));

  return {
    rotateX,
    rotateY,
    glareX,
    glareY,
  };
}

const INITIAL_TILT_STATE: TiltState = {
  rotateX: 0,
  rotateY: 0,
  glareX: 50,
  glareY: 50,
  isActive: false,
};

export function useTilt3D(options: UseTilt3DOptions = {}): UseTilt3DResult {
  const { maxTiltDeg = DEFAULT_MAX_TILT_DEG, disabled = false } = options;
  const prefersReducedMotion = useReducedMotion();
  const isReducedMotion = Boolean(prefersReducedMotion || disabled);

  const ref = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState<TiltState>(INITIAL_TILT_STATE);

  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);
  const rawGlareX = useMotionValue(50);
  const rawGlareY = useMotionValue(50);

  const springConfig = { stiffness: 260, damping: 24, mass: 0.6 };
  const rotateXSpring = useSpring(rawRotateX, springConfig);
  const rotateYSpring = useSpring(rawRotateY, springConfig);
  const glareXSpring = useSpring(rawGlareX, springConfig);
  const glareYSpring = useSpring(rawGlareY, springConfig);

  const glareBackground = useMotionTemplate`radial-gradient(320px circle at ${glareXSpring}% ${glareYSpring}%, rgba(255, 255, 255, 0.10), transparent 75%)`;

  const resetTilt = useCallback(() => {
    rawRotateX.set(0);
    rawRotateY.set(0);
    rawGlareX.set(50);
    rawGlareY.set(50);
    setTilt(INITIAL_TILT_STATE);
  }, [rawGlareX, rawGlareY, rawRotateX, rawRotateY]);

  useEffect(() => {
    if (isReducedMotion) {
      resetTilt();
    }
  }, [isReducedMotion, resetTilt]);

  const updateFromCoordinates = useCallback(
    (clientX: number, clientY: number, currentTarget?: HTMLElement | null) => {
      if (isReducedMotion) {
        return;
      }
      const element = currentTarget ?? ref.current;
      const rect = element?.getBoundingClientRect() ?? {
        left: 0,
        top: 0,
        width: 360,
        height: 220,
      };

      const next = calculateTiltFromPoint(clientX, clientY, rect, maxTiltDeg);
      rawRotateX.set(next.rotateX);
      rawRotateY.set(next.rotateY);
      rawGlareX.set(next.glareX);
      rawGlareY.set(next.glareY);
      setTilt({
        ...next,
        isActive: true,
      });
    },
    [isReducedMotion, maxTiltDeg, rawGlareX, rawGlareY, rawRotateX, rawRotateY]
  );

  const onPointerEnter = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      updateFromCoordinates(event.clientX, event.clientY, event.currentTarget);
    },
    [updateFromCoordinates]
  );

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      updateFromCoordinates(event.clientX, event.clientY, event.currentTarget);
    },
    [updateFromCoordinates]
  );

  const onMouseMove = useCallback(
    (event: ReactMouseEvent<HTMLElement>) => {
      updateFromCoordinates(event.clientX, event.clientY, event.currentTarget);
    },
    [updateFromCoordinates]
  );

  const onTouchMove = useCallback(
    (event: ReactTouchEvent<HTMLElement>) => {
      if (isReducedMotion) return;
      const touch = event.touches?.[0];
      if (!touch) return;
      updateFromCoordinates(touch.clientX, touch.clientY, event.currentTarget);
    },
    [isReducedMotion, updateFromCoordinates]
  );

  return {
    ref,
    tilt: isReducedMotion ? INITIAL_TILT_STATE : tilt,
    isReducedMotion,
    rotateXSpring,
    rotateYSpring,
    glareBackground,
    handlers: {
      onPointerEnter,
      onPointerMove,
      onPointerLeave: resetTilt,
      onMouseMove,
      onMouseLeave: resetTilt,
      onTouchMove,
      onTouchEnd: resetTilt,
    },
    resetTilt,
  };
}
