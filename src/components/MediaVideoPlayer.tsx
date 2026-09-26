import React, { useRef, useEffect, useState } from 'react';
import { VideoSettings } from '../types';

interface MediaVideoPlayerProps {
  video: VideoSettings;
  className?: string;
  fallbackImage?: string;
  isBackground?: boolean;
}

export const MediaVideoPlayer: React.FC<MediaVideoPlayerProps> = ({
  video,
  className = '',
  fallbackImage,
  isBackground = false
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Lazy-load video only when nearing viewport
  useEffect(() => {
    if (isBackground) {
      // Hero background video loads immediately
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '200px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [isBackground]);

  // Handle autoplay if enabled and in view
  useEffect(() => {
    if (isVisible && videoRef.current && video.autoplay) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay was prevented by browser policy (e.g. unmuted); mute and retry
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play().catch(() => {});
          }
        });
      }
    }
  }, [isVisible, video.autoplay]);

  if (!video.enabled || hasError) {
    if (fallbackImage) {
      return (
        <img
          src={fallbackImage}
          alt={video.title || 'Ankobeng Motors Media'}
          className={className}
        />
      );
    }
    return null;
  }

  const posterImage = video.poster || fallbackImage;

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {isVisible ? (
        <video
          ref={videoRef}
          src={video.url}
          autoPlay={video.autoplay}
          muted={video.muted}
          loop={video.loop}
          controls={video.showControls}
          playsInline
          poster={posterImage}
          preload={isBackground ? 'auto' : 'metadata'}
          onError={() => setHasError(true)}
          className={`w-full h-full object-cover ${isBackground ? 'pointer-events-none' : ''}`}
        />
      ) : (
        posterImage && (
          <img
            src={posterImage}
            alt={video.title || 'Video preview'}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        )
      )}
    </div>
  );
};
