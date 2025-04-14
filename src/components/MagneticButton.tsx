import React, { useState, useRef, useEffect } from 'react';

interface MagneticButtonProps {
  children: React.ReactNode;
  strength?: number; // 磁性强度
  radius?: number; // 作用半径
  className?: string;
  onClick?: () => void;
}

const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  strength = 0.5,
  radius = 150,
  className = '',
  onClick
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  
  useEffect(() => {
    if (!isHovered) {
      // 重置位置
      setPosition({ x: 0, y: 0 });
    }
  }, [isHovered]);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    
    // 获取按钮位置和尺寸
    const rect = buttonRef.current.getBoundingClientRect();
    
    // 计算鼠标相对按钮中心的位置
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    // 计算鼠标到按钮中心的距离
    const distanceX = mouseX - centerX;
    const distanceY = mouseY - centerY;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    
    // 如果在作用半径内，应用磁性效果
    if (distance < radius) {
      const magneticX = (distanceX / radius) * strength * 20;
      const magneticY = (distanceY / radius) * strength * 20;
      setPosition({ x: magneticX, y: magneticY });
    } else {
      setPosition({ x: 0, y: 0 });
    }
  };
  
  return (
    <button
      ref={buttonRef}
      className={`magnetic-button ${className}`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: isHovered ? 'none' : 'transform 0.3s ease',
        position: 'relative',
        cursor: 'pointer',
        border: 'none',
        background: 'transparent',
        padding: '12px 24px',
        display: 'inline-block',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default MagneticButton; 