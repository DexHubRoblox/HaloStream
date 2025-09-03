import { useState, useEffect, useRef } from 'react';
import { lazyLoadManager } from '@/utils/lazyLoading';

// Hook for lazy loading images
export const useLazyImage = (src: string, placeholder?: string) => {
  const [imageSrc, setImageSrc] = useState(placeholder || '');
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const imgElement = imgRef.current;
    if (!imgElement || !src) return;

    const loadImage = () => {
      const img = new Image();
      img.onload = () => {
        setImageSrc(src);
        setIsLoaded(true);
      };
      img.onerror = () => {
        setIsLoaded(true); // Still mark as loaded to prevent infinite loading
      };
      img.src = src;
    };

    lazyLoadManager.observe(imgElement, loadImage);

    return () => {
      lazyLoadManager.unobserve(imgElement);
    };
  }, [src]);

  return { imageSrc, isLoaded, imgRef };
};