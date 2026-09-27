import React, { useState, useEffect } from 'react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean; // high priority / eager above the fold
  aspectRatio?: string; // e.g. "aspect-[4/3]", "aspect-[16/10]"
  objectFit?: 'cover' | 'contain';
}

// In-memory cache of already decoded/loaded image URLs in this session
export const loadedImageCache = new Set<string>();

// Preload and decode helper function for critical images
export function preloadAndDecodeImage(url: string): Promise<void> {
  if (!url || loadedImageCache.has(url)) return Promise.resolve();
  return new Promise((resolve) => {
    const img = new Image();
    img.src = url;
    if (img.decode) {
      img
        .decode()
        .then(() => {
          loadedImageCache.add(url);
          resolve();
        })
        .catch(() => {
          loadedImageCache.add(url);
          resolve();
        });
    } else {
      img.onload = () => {
        loadedImageCache.add(url);
        resolve();
      };
      img.onerror = () => {
        loadedImageCache.add(url);
        resolve();
      };
    }
  });
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  priority = false,
  aspectRatio,
  objectFit = 'cover',
  ...rest
}) => {
  const isCached = loadedImageCache.has(src);
  const [isReady, setIsReady] = useState<boolean>(isCached);
  const [displaySrc, setDisplaySrc] = useState<string>(src);

  useEffect(() => {
    if (!src) return;

    if (loadedImageCache.has(src)) {
      setDisplaySrc(src);
      setIsReady(true);
      return;
    }

    let isCancelled = false;
    const img = new Image();
    img.src = src;

    const handleSuccess = () => {
      if (!isCancelled) {
        loadedImageCache.add(src);
        setDisplaySrc(src);
        setIsReady(true);
      }
    };

    if (img.decode) {
      img.decode().then(handleSuccess).catch(handleSuccess);
    } else {
      img.onload = handleSuccess;
      img.onerror = handleSuccess;
    }

    return () => {
      isCancelled = true;
    };
  }, [src]);

  return (
    <img
      src={displaySrc}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding={priority ? 'sync' : 'async'}
      className={`${objectFit === 'cover' ? 'object-cover' : 'object-contain'} transition-opacity duration-300 ${
        isReady ? 'opacity-100' : 'opacity-0'
      } ${className}`}
      {...rest}
    />
  );
};

