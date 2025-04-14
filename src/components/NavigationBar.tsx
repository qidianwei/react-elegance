import React, { useState, useEffect } from 'react';
import styles from './NavigationBar.module.css';

interface NavLink {
  text: string;
  url: string;
}

interface NavigationBarProps {
  links: NavLink[];
  isSticky?: boolean;
}

const NavigationBar: React.FC<NavigationBarProps> = ({
  links,
  isSticky = false,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Close mobile menu when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && menuOpen) {
        setMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [menuOpen]);

  // Handle scroll event for sticky nav
  useEffect(() => {
    if (!isSticky) return;

    const handleScroll = () => {
      if (window.scrollY > 80) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isSticky]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav 
      className={`
        ${styles.navbar} 
        ${isSticky ? styles.sticky : ''} 
        ${scrolled ? styles.scrolled : ''}
      `}
    >
      <div className={styles.navContainer}>
        <div className={styles.logoContainer}>
          <a href="/" className={styles.logo}>
            React Elegance
          </a>
        </div>

        {/* Desktop Navigation */}
        <ul className={styles.navLinks}>
          {links.map((link, index) => (
            <li key={index} className={styles.navItem}>
              <a href={link.url} className={styles.navLink}>
                {link.text}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile Navigation Toggle */}
        <div 
          className={`${styles.hamburger} ${menuOpen ? styles.active : ''}`} 
          onClick={toggleMenu}
        >
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.open : ''}`}>
        <ul className={styles.mobileNavLinks}>
          {links.map((link, index) => (
            <li key={index} className={styles.mobileNavItem}>
              <a 
                href={link.url} 
                className={styles.mobileNavLink}
                onClick={() => setMenuOpen(false)}
              >
                {link.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default NavigationBar; 