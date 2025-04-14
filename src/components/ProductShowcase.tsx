import React, { useRef, useState, useEffect } from 'react';

interface ProductShowcaseProps {
  children: React.ReactNode;
  maxRotation?: number; // 最大旋转角度
  rotateOnScroll?: boolean; // 是否在滚动时旋转
  className?: string;
}

const ProductShowcase: React.FC<ProductShowcaseProps> = ({
  children,
  maxRotation = 20,
  rotateOnScroll = true,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({
    rotateX: 0,
    rotateY: 0,
    scale: 1,
  });
  const [isInView, setIsInView] = useState(false);
  
  // 处理鼠标移动时的旋转效果
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    
    // 计算鼠标相对于元素中心的位置，范围从-1到1
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    // 将相对位置转换为旋转角度
    const rotateY = ((mouseX - centerX) / (rect.width / 2)) * maxRotation;
    const rotateX = -((mouseY - centerY) / (rect.height / 2)) * maxRotation;
    
    setTransform({
      ...transform,
      rotateX,
      rotateY,
      scale: 1.05, // 轻微放大效果
    });
  };
  
  // 监听滚动，判断元素是否在视口中
  useEffect(() => {
    if (!rotateOnScroll) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [rotateOnScroll]);
  
  // 滚动时应用动画
  useEffect(() => {
    if (!rotateOnScroll) return;
    
    let requestId: number;
    let scrollY = window.scrollY;
    let rotationY = 0;
    
    const animate = () => {
      if (!containerRef.current || !isInView) return;
      
      // 计算滚动引起的旋转
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - scrollY;
      scrollY = currentScrollY;
      
      // 将滚动转换为Y轴旋转
      rotationY += scrollDelta * 0.05;
      rotationY *= 0.9; // 添加阻尼效果
      
      // 限制旋转角度
      rotationY = Math.max(Math.min(rotationY, maxRotation), -maxRotation);
      
      setTransform(prev => ({
        ...prev,
        rotateY: rotationY,
      }));
      
      requestId = requestAnimationFrame(animate);
    };
    
    if (isInView) {
      requestId = requestAnimationFrame(animate);
    }
    
    return () => {
      cancelAnimationFrame(requestId);
    };
  }, [isInView, maxRotation, rotateOnScroll]);
  
  // 当鼠标离开时重置变换
  const handleMouseLeave = () => {
    if (!rotateOnScroll) {
      setTransform({
        rotateX: 0,
        rotateY: 0,
        scale: 1,
      });
    }
  };
  
  return (
    <div
      ref={containerRef}
      className={`product-showcase ${className}`}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={!rotateOnScroll ? handleMouseMove : undefined}
      onMouseLeave={!rotateOnScroll ? handleMouseLeave : undefined}
    >
      <div
        style={{
          transform: `
            rotateX(${transform.rotateX}deg) 
            rotateY(${transform.rotateY}deg)
            scale(${transform.scale})
          `,
          transition: 'transform 0.1s ease-out',
          transformStyle: 'preserve-3d',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default ProductShowcase; 