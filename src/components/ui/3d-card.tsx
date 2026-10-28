import {
  createContext,
  useContext,
  type ElementType,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { useTilt3D } from '../../hooks/useTilt3D';

export interface TiltCardContextValue {
  isActive: boolean;
  isReducedMotion: boolean;
}

const MouseEnterContext = createContext<TiltCardContextValue>({
  isActive: false,
  isReducedMotion: false,
});

export interface CardContainerProps {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  ariaLabel?: string;
  maxTiltDeg?: number;
  disabled?: boolean;
}

export function CardContainer({
  children,
  className,
  containerClassName,
  ariaLabel,
  maxTiltDeg = 12,
  disabled = false,
}: CardContainerProps): ReactElement {
  const {
    ref,
    tilt,
    isReducedMotion,
    rotateXSpring,
    rotateYSpring,
    glareBackground,
    handlers,
  } = useTilt3D({ maxTiltDeg, disabled });

  return (
    <MouseEnterContext.Provider value={{ isActive: tilt.isActive, isReducedMotion }}>
      <div
        className={cn('perspective-1000 flex w-full items-center justify-center', containerClassName)}
        style={{ perspective: '1000px' }}
      >
        <motion.div
          ref={ref}
          data-testid="card-3d-interactive"
          data-reduced-motion={String(isReducedMotion)}
          data-tilt-active={String(tilt.isActive)}
          data-rotate-x={String(tilt.rotateX)}
          data-rotate-y={String(tilt.rotateY)}
          aria-label={ariaLabel}
          onPointerEnter={handlers.onPointerEnter}
          onPointerMove={handlers.onPointerMove}
          onPointerLeave={handlers.onPointerLeave}
          onMouseMove={handlers.onMouseMove}
          onMouseLeave={handlers.onMouseLeave}
          onTouchMove={handlers.onTouchMove}
          onTouchEnd={handlers.onTouchEnd}
          style={
            isReducedMotion
              ? { transformStyle: 'flat', transform: 'none' }
              : {
                  rotateX: rotateXSpring,
                  rotateY: rotateYSpring,
                  transformStyle: 'preserve-3d',
                }
          }
          className={cn(
            'preserve-3d relative w-full transition-shadow duration-300 will-change-transform',
            className
          )}
        >
          {children}
          {!isReducedMotion && (
            <motion.div
              data-testid="card-3d-glare"
              aria-hidden="true"
              style={{
                background: glareBackground,
                opacity: tilt.isActive ? 1 : 0,
              }}
              className="pointer-events-none absolute inset-0 z-20 rounded-2xl transition-opacity duration-300"
            />
          )}
        </motion.div>
      </div>
    </MouseEnterContext.Provider>
  );
}

export interface CardBodyProps {
  children: ReactNode;
  className?: string;
}

export function CardBody({ children, className }: CardBodyProps): ReactElement {
  return (
    <div
      className={cn(
        'preserve-3d relative h-full w-full [&>*]:[transform-style:preserve-3d]',
        className
      )}
    >
      {children}
    </div>
  );
}

export interface CardItemProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  translateX?: number;
  translateY?: number;
  translateZ?: number;
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
}

export function CardItem({
  as: Tag = 'div',
  children,
  className,
  translateX = 0,
  translateY = 0,
  translateZ = 0,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  style,
  ...rest
}: CardItemProps): ReactElement {
  const { isActive, isReducedMotion } = useMouseEnter();
  const shouldTransform = isActive && !isReducedMotion;

  const computedTransform = shouldTransform
    ? `translate3d(${translateX}px, ${translateY}px, ${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`
    : 'translate3d(0px, 0px, 0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)';

  return (
    <Tag
      className={cn('transition-transform duration-200 ease-out', className)}
      style={{
        ...style,
        transform: isReducedMotion ? 'none' : computedTransform,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function useMouseEnter(): TiltCardContextValue {
  return useContext(MouseEnterContext);
}
