import React, { useRef, useEffect, useState } from 'react';
import styles from './ParallaxLayer.module.css';

interface ParallaxLayerProps {
  children: React.ReactNode;
  speed: number;
  axis?: 'vertical' | 'horizontal';
  root?: React.RefObject<HTMLElement>;
  className?: string;
  style?: React.CSSProperties;
}

const ParallaxLayer: React.FC<ParallaxLayerProps> = ({
  children,
  speed,
  axis = 'vertical',
  root,
  className = '',
  style = {},
}) => {
  const layerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const frameRef = useRef<number>(0);
  const isScrolling = useRef(false);
  const lastScrollPos = useRef(0);

  // Function to calculate translate value based on scroll position
  const calculateTranslate = () => {
    if (!layerRef.current) return;

    const scrollPosition = root?.current 
      ? root.current.scrollTop || root.current.scrollLeft || 0
      : axis === 'vertical'
        ? window.scrollY
        : window.scrollY;
    
    const layerRect = layerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    // Only apply parallax when the element is in or near the viewport
    const isVisible = axis === 'vertical'
      ? layerRect.bottom > -viewportHeight && layerRect.top < viewportHeight * 2
      : layerRect.right > -viewportWidth && layerRect.left < viewportWidth * 2;

    if (isVisible) {
      // Calculate new offset based on scroll position and speed
      const newOffset = scrollPosition * speed;
      setOffset(newOffset);
    }
    
    lastScrollPos.current = scrollPosition;
    isScrolling.current = false;
  };

  // Set up scroll event handler with requestAnimationFrame
  useEffect(() => {
    const handleScroll = () => {
      if (!isScrolling.current) {
        isScrolling.current = true;
        frameRef.current = requestAnimationFrame(calculateTranslate);
      }
    };

    const scrollContainer = root?.current || window;
    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial calculation
    calculateTranslate();

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [speed, axis, root]);

  // Generate transform style based on axis and offset
  const getTransformStyle = () => {
    if (axis === 'vertical') {
      return `translateY(${offset}px)`;
    } else {
      return `translateX(${offset}px)`;
    }
  };

  const combinedStyle: React.CSSProperties = {
    ...style,
    transform: getTransformStyle(),
    willChange: 'transform',
    transition: isScrolling.current ? 'none' : 'transform 0.1s ease-out',
  };

  return (
    <div 
      ref={layerRef} 
      className={`${styles.parallaxLayer} ${className}`} 
      style={combinedStyle}
    >
      {children}
    </div>
  );
};

export default ParallaxLayer; 