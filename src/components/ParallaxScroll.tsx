import React, { useEffect, useRef, useState } from 'react';

interface ParallaxScrollProps {
  children: React.ReactNode;
  speed?: number; // 视差效果的速度，正数向下移动慢，负数向上移动慢
  scale?: number; // 缩放效果，1.0表示无缩放
  className?: string;
}

const ParallaxScroll: React.FC<ParallaxScrollProps> = ({ 
  children, 
  speed = -1.5,
  scale = 1.15,
  className = '' 
}) => {
  const [offset, setOffset] = useState(0);
  const [scaleValue, setScaleValue] = useState(1);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      
      const { top, height } = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // 元素进入视口时开始计算偏移量
      if (top < windowHeight && top > -height) {
        // 计算基于滚动位置的偏移量
        const progress = Math.min(Math.max((windowHeight - top) / (windowHeight + height), 0), 1);
        const newOffset = progress * speed * 100; // 使用百分比来调整移动距离
        setOffset(newOffset);
        
        // 计算缩放效果 - 元素在视口中心时达到最大缩放
        const scrollProgress = 1 - (Math.abs(top - windowHeight / 2)) / (windowHeight + height / 2);
        const newScale = 1 + (scale - 1) * Math.max(0, scrollProgress);
        setScaleValue(newScale);
      } else {
        // 元素不在视口内时重置状态
        setOffset(0);
        setScaleValue(1);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 初始化计算
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [speed, scale]);
  
  return (
    <div 
      ref={sectionRef} 
      className={`parallax-container ${className}`}
      style={{ 
        position: 'relative', 
        overflow: 'hidden',
        minHeight: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          transform: `translateY(${offset}px) scale(${scaleValue})`,
          transition: 'transform 0.1s ease-out',
          width: '100%',
          willChange: 'transform',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default ParallaxScroll; 