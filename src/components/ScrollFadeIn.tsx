import React, { useRef, useEffect, useState } from 'react';
import styles from './ScrollFadeIn.module.css';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

interface ScrollFadeInProps {
  children: React.ReactNode;
  direction?: Direction;
  offset?: string | number;
  distance?: string;
  duration?: number;
  delay?: number;
  easing?: string;
  triggerOnce?: boolean;
  as?: React.ElementType;
  className?: string;
}

const ScrollFadeIn: React.FC<ScrollFadeInProps> = ({
  children,
  direction = 'none',
  offset = '0px',
  distance = '30px',
  duration = 0.8,
  delay = 0,
  easing = 'ease-out',
  triggerOnce = false,
  as: Component = 'div',
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const hasTriggered = useRef(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Convert offset to rootMargin format for IntersectionObserver
    let rootMargin: string;
    if (typeof offset === 'number') {
      rootMargin = `${offset}px`;
    } else {
      rootMargin = offset;
    }

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      
      if (entry.isIntersecting) {
        if (!triggerOnce || (triggerOnce && !hasTriggered.current)) {
          setIsVisible(true);
          hasTriggered.current = true;
        }
      } else if (!triggerOnce) {
        setIsVisible(false);
        hasTriggered.current = false;
      }
    };

    const options: IntersectionObserverInit = {
      root: null, // viewport
      rootMargin,
      threshold: 0.1, // 10% of the element is visible
    };

    const observer = new IntersectionObserver(handleIntersection, options);
    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [offset, triggerOnce]);

  // Generate CSS based on props
  const getTransformValue = (): string => {
    switch (direction) {
      case 'up':
        return `translateY(${distance})`;
      case 'down':
        return `translateY(-${distance})`;
      case 'left':
        return `translateX(${distance})`;
      case 'right':
        return `translateX(-${distance})`;
      case 'none':
      default:
        return 'translate(0, 0)';
    }
  };

  const style: React.CSSProperties = {
    opacity: 0,
    transform: getTransformValue(),
    transition: `opacity ${duration}s ${easing} ${delay}s, transform ${duration}s ${easing} ${delay}s`,
  };

  const visibleStyle: React.CSSProperties = {
    opacity: 1,
    transform: 'translate(0, 0)',
  };

  const combinedStyle = isVisible
    ? { ...style, ...visibleStyle }
    : style;

  return (
    <Component
      ref={elementRef}
      className={`${styles.scrollFadeIn} ${className}`}
      style={combinedStyle}
    >
      {children}
    </Component>
  );
};

export default ScrollFadeIn; 