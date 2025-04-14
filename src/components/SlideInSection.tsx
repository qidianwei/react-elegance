import React, { useRef, useState, useEffect } from 'react';

interface SlideInSectionProps {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'top' | 'bottom';
  distance?: number; // 滑动距离（像素）
  duration?: number; // 动画持续时间（毫秒）
  delay?: number; // 延迟时间（毫秒）
  threshold?: number; // 触发阈值（0-1）
  className?: string;
}

const SlideInSection: React.FC<SlideInSectionProps> = ({
  children,
  direction = 'left',
  distance = 100,
  duration = 1000,
  delay = 0,
  threshold = 0.2,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // 元素进入视口
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
          
          // 元素已经显示后，解除观察
          if (sectionRef.current) {
            observer.unobserve(sectionRef.current);
          }
        }
      },
      { threshold }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [delay, threshold]);
  
  // 根据方向计算初始位置
  const getInitialTransform = () => {
    switch (direction) {
      case 'left':
        return `translateX(-${distance}px)`;
      case 'right':
        return `translateX(${distance}px)`;
      case 'top':
        return `translateY(-${distance}px)`;
      case 'bottom':
        return `translateY(${distance}px)`;
      default:
        return `translateX(-${distance}px)`;
    }
  };
  
  // 计算动画持续时间
  const animationDuration = `${duration / 1000}s`;
  
  return (
    <div
      ref={sectionRef}
      className={`slide-in-section ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translate(0, 0)' : getInitialTransform(),
        transition: `opacity ${animationDuration} cubic-bezier(0.165, 0.84, 0.44, 1), transform ${animationDuration} cubic-bezier(0.165, 0.84, 0.44, 1)`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
};

export default SlideInSection;
