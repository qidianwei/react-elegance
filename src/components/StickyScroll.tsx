import React, { useEffect, useRef, useState } from 'react';

interface StickyScrollProps {
  children: React.ReactNode;
  startColor?: string;
  endColor?: string;
  height?: string;
  stickyPosition?: number;  // 粘性位置占视窗高度的百分比，0-100
  className?: string;
}

const StickyScroll: React.FC<StickyScrollProps> = ({
  children,
  startColor = '#000000',
  endColor = '#0071e3',
  height = '200vh',
  stickyPosition = 20,
  className = '',
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const currentContainer = containerRef.current;
    if (!currentContainer) return;

    const handleScroll = () => {
      const rect = currentContainer.getBoundingClientRect();
      const progress = Math.min(Math.max(-rect.top / (rect.height - window.innerHeight), 0), 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const interpolateColor = (color1: string, color2: string, factor: number): string => {
    // Clamp factor
    const clampedFactor = Math.max(0, Math.min(1, factor));

    const hexToRgb = (hex: string): number[] | null => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
        ] : null;
    };

    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);

    if (!rgb1 || !rgb2) return color1; // Return start color on parse error

    const r = Math.round(rgb1[0] + clampedFactor * (rgb2[0] - rgb1[0]));
    const g = Math.round(rgb1[1] + clampedFactor * (rgb2[1] - rgb1[1]));
    const b = Math.round(rgb1[2] + clampedFactor * (rgb2[2] - rgb1[2]));

    const componentToHex = (c: number): string => {
        const hex = c.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    };

    return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
  };
  
  const currentColor = interpolateColor(startColor, endColor, scrollProgress);
  
  // Define styles separately for clarity
  const containerStyle: React.CSSProperties = {
    height,
    position: 'relative',
    background: `linear-gradient(135deg, ${currentColor}, ${interpolateColor(currentColor, '#ffffff', 0.3)})`,
    transition: 'background 0.3s ease'
  };

  const contentStyle: React.CSSProperties = {
    position: 'sticky',
    top: `${stickyPosition}vh`,
    padding: '2rem',
    zIndex: 2
  };
  
  return (
    <div 
      ref={containerRef}
      className={`sticky-scroll-container ${className}`}
      style={containerStyle}
    >
      <div 
        className="sticky-content"
        style={contentStyle}
      >
        {children}
      </div>
    </div>
  );
};

export default StickyScroll; 