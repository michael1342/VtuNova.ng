import React, { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import type { ScrollRevealProps } from '../../interface/components.interface';

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 750,
  threshold = 0.12,
  className = '',
  style = {},
  as: Component = 'div',
  once = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const currentElem = domRef.current;
    if (!currentElem) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once && currentElem) {
            observer.unobserve(currentElem);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(currentElem);

    return () => {
      if (currentElem) {
        observer.unobserve(currentElem);
      }
    };
  }, [threshold, once]);

  // Initial hidden transform styles based on animation type
  const getInitialTransform = () => {
    switch (animation) {
      case 'fade-up':
        return 'translate3d(0, 42px, 0)';
      case 'fade-down':
        return 'translate3d(0, -42px, 0)';
      case 'fade-left':
        return 'translate3d(-48px, 0, 0)';
      case 'fade-right':
        return 'translate3d(48px, 0, 0)';
      case 'zoom-in':
        return 'scale3d(0.92, 0.92, 1) translate3d(0, 20px, 0)';
      case 'zoom-out':
        return 'scale3d(1.08, 1.08, 1)';
      case 'flip-up':
        return 'perspective(1000px) rotateX(18deg) translate3d(0, 30px, 0)';
      default:
        return 'translate3d(0, 42px, 0)';
    }
  };

  const combinedStyles: CSSProperties = {
    ...style,
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translate3d(0, 0, 0) scale3d(1, 1, 1) rotateX(0deg)' : getInitialTransform(),
    filter: isVisible ? 'blur(0px)' : 'blur(4px)',
    transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1), transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1), filter ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
    transitionDelay: `${delay}ms`,
    willChange: 'opacity, transform, filter',
  };

  return (
    <Component
      ref={domRef}
      className={`reveal-element ${className}`}
      style={combinedStyles}
    >
      {children}
    </Component>
  );
};

export default ScrollReveal;
