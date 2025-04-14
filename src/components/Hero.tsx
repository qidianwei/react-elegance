import React, { useState, useEffect, useRef } from 'react';
import styles from './Hero.module.css';

interface HeroProps {
  imageSrc: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  isParallax?: boolean;
}

const Hero: React.FC<HeroProps> = ({
  imageSrc,
  title,
  subtitle,
  ctaText,
  ctaLink,
  isParallax = false,
}) => {
  const [visible, setVisible] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  // Fade-in effect on load
  useEffect(() => {
    setVisible(true);
  }, []);

  // Parallax scroll effect
  useEffect(() => {
    if (!isParallax) return;

    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isParallax]);

  // Calculate parallax position
  const parallaxStyle = isParallax ? {
    transform: `translateY(${scrollPosition * 0.4}px)`,
  } : {};

  return (
    <div className={styles.hero} ref={heroRef}>
      <div 
        className={styles.heroBackground} 
        style={{ 
          backgroundImage: `url(${imageSrc})`,
          ...parallaxStyle,
          opacity: visible ? 1 : 0,
        }}
      />
      <div 
        className={`${styles.heroContent} ${visible ? styles.visible : ''}`}
      >
        <h1 className={styles.heroTitle}>{title}</h1>
        <h2 className={styles.heroSubtitle}>{subtitle}</h2>
        <a 
          href={ctaLink} 
          className={styles.heroButton}
        >
          {ctaText}
        </a>
      </div>
    </div>
  );
};

export default Hero; 