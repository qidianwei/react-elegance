import React, { useState } from 'react';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  imageSrc: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  imageSrc,
  title,
  description,
  ctaText,
  ctaLink,
  className = '',
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div className={`${styles.productCard} ${className}`}>
      <div className={styles.imageContainer}>
        {!imageLoaded && <div className={styles.imagePlaceholder} />}
        <img
          src={imageSrc}
          alt={title}
          className={`${styles.productImage} ${imageLoaded ? styles.loaded : ''}`}
          loading="lazy"
          onLoad={handleImageLoad}
        />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
        <a href={ctaLink} className={styles.ctaButton}>
          {ctaText}
        </a>
      </div>
    </div>
  );
};

export default ProductCard; 