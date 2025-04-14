import React, { useRef, useState, useEffect } from 'react';

interface FadeInViewProps {
  children: React.ReactNode;
  delay?: number; // 延迟时间（毫秒）
  duration?: number; // 动画持续时间（毫秒）
  threshold?: number; // 触发阈值（0-1）
  translateY?: number; // Y轴位移（像素）
  className?: string;
}

const FadeInView: React.FC<FadeInViewProps> = ({
  children,
  delay = 0,
  duration = 1000,
  threshold = 0.2,
  translateY = 30,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // 元素进入视口
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
          
          // 元素已经显示后，解除观察
          if (elementRef.current) {
            observer.unobserve(elementRef.current);
          }
        }
      },
      { threshold }
    );
    
    if (elementRef.current) {
      observer.observe(elementRef.current);
    }
    
    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [delay, threshold]);
  
  // 计算动画持续时间
  const animationDuration = `${duration / 1000}s`;
  
  return (
    <div
      ref={elementRef}
      className={`fade-in-view ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? 'translateY(0)'
          : `translateY(${translateY}px)`,
        transition: `opacity ${animationDuration} ease-out, transform ${animationDuration} ease-out`,
      }}
    >
      {children}
    </div>
  );
};

export default FadeInView; 