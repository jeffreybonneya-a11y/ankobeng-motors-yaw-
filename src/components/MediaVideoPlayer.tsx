import React, { useState } from 'react';
import { VideoSettings } from '../types';
import { Play } from 'lucide-react';

interface MediaVideoPlayerProps {
  video?: VideoSettings;
  className?: string;
  fallbackImage?: string;
}

export const MediaVideoPlayer: React.FC<MediaVideoPlayerProps> = ({
  video,
  className = '',
  fallbackImage
}) => {
  const [hasError, setHasError] = useState(false);
  const videoSrc = video?.url || video?.videoUrl;

  if (!video || !video.enabled || !videoSrc || hasError) {
    if (fallbackImage) {
      return (
        <img
          src={fallbackImage}
          alt={video?.title || 'Media visual'}
          className={`object-cover ${className}`}
          loading="lazy"
        />
      );
    }
    return null;
  }

  return (
    <div className={`relative overflow-hidden bg-black flex items-center justify-center ${className}`}>
      <video
        src={videoSrc}
        poster={video.posterUrl || fallbackImage}
        autoPlay={video.autoplay ?? false}
        muted={video.muted ?? true}
        loop={video.loop ?? true}
        controls={video.controls ?? true}
        playsInline
        preload="metadata"
        onError={() => setHasError(true)}
        className="w-full h-full object-cover"
      />
    </div>
  );
};
