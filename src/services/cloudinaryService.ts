/**
 * Cloudinary Direct Upload Service for ANKOBENG MOTORS
 * Cloud Name: zpzdjznd
 * Upload Preset: ankobeng(yaw)_upload
 * Direct client-side unsigned upload (no API secret exposed)
 * Supports BOTH Images and Videos (Strictly up to 50s duration limit for videos)
 */

export const CLOUDINARY_CONFIG = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'zpzdjznd',
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'ankobeng(yaw)_upload',
  imageUploadUrl: `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'zpzdjznd'}/image/upload`,
  videoUploadUrl: `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'zpzdjznd'}/video/upload`,
  autoUploadUrl: `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'zpzdjznd'}/auto/upload`
};

export const MAX_VIDEO_DURATION_SECONDS = 50; // Strict 50 seconds limit

export interface CloudinaryUploadResult {
  url: string;
  secureUrl: string;
  publicId: string;
  originalFilename: string;
  format: string;
  bytes: number;
  width?: number;
  height?: number;
  resourceType: 'image' | 'video';
  duration?: number;
  thumbnailUrl?: string;
}

/**
 * Validates video duration client-side before or during upload.
 * Returns video duration in seconds.
 */
export const getVideoDuration = (file: File | Blob): Promise<number> => {
  return new Promise((resolve) => {
    try {
      const video = document.createElement('video');
      video.preload = 'metadata';
      const objectUrl = URL.createObjectURL(file);
      
      const timeout = setTimeout(() => {
        URL.revokeObjectURL(objectUrl);
        // If metadata takes too long, resolve with 0 to allow server-side check
        resolve(0);
      }, 8000);

      video.onloadedmetadata = () => {
        clearTimeout(timeout);
        URL.revokeObjectURL(objectUrl);
        resolve(video.duration || 0);
      };

      video.onerror = () => {
        clearTimeout(timeout);
        URL.revokeObjectURL(objectUrl);
        resolve(0);
      };

      video.src = objectUrl;
    } catch {
      resolve(0);
    }
  });
};

/**
 * Checks whether a file or filename is a video.
 */
export const isVideoFile = (file: File | Blob, fileName?: string): boolean => {
  if (file.type && file.type.startsWith('video/')) return true;
  const name = fileName || (file instanceof File ? file.name : '');
  const ext = name.split('.').pop()?.toLowerCase() || '';
  return ['mp4', 'webm', 'mov', 'avi', 'mkv', 'ogv', 'm4v', '3gp', 'flv', 'wmv'].includes(ext);
};

/**
 * Helper to generate Cloudinary video thumbnail URL from secure_url
 */
export const getCloudinaryVideoThumbnail = (videoUrl: string, publicId?: string): string => {
  if (!videoUrl) return '';
  if (videoUrl.includes('cloudinary.com')) {
    // Cloudinary supports changing extension to .jpg for video snapshot
    return videoUrl.replace(/\.(mp4|webm|mov|avi|mkv|ogv|m4v|3gp|flv|wmv)$/i, '.jpg');
  }
  return '';
};

/**
 * Uploads an image or video file directly to Cloudinary using unsigned upload preset.
 * Enforces the 50-second maximum duration rule for videos.
 */
export const uploadToCloudinary = async (
  file: File | Blob,
  fileName?: string,
  onProgress?: (percent: number) => void
): Promise<CloudinaryUploadResult> => {
  const isVideo = isVideoFile(file, fileName);
  let detectedDuration = 0;

  // Enforce 50-second maximum video duration
  if (isVideo) {
    detectedDuration = await getVideoDuration(file);
    if (detectedDuration > MAX_VIDEO_DURATION_SECONDS) {
      throw new Error(
        `Video duration exceeds the maximum limit of ${MAX_VIDEO_DURATION_SECONDS} seconds (Selected: ${Math.round(detectedDuration)}s). Please choose a video of 50 seconds or shorter.`
      );
    }
  }

  const endpoint = isVideo 
    ? CLOUDINARY_CONFIG.videoUploadUrl 
    : CLOUDINARY_CONFIG.imageUploadUrl;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);

  const response = await fetch(endpoint, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.error?.message || `Cloudinary upload failed with status ${response.status}`;
    throw new Error(message);
  }

  const data = await response.json();
  const returnedDuration = data.duration ? Number(data.duration) : detectedDuration;

  // Double-check Cloudinary's measured video duration if available
  if (isVideo && returnedDuration > MAX_VIDEO_DURATION_SECONDS) {
    throw new Error(
      `Cloudinary validated video duration as ${Math.round(returnedDuration)}s, which exceeds the ${MAX_VIDEO_DURATION_SECONDS}s maximum limit.`
    );
  }

  const secureUrl = data.secure_url || data.url;
  const resourceType = (data.resource_type === 'video' || isVideo) ? 'video' : 'image';
  const format = data.format || (isVideo ? 'mp4' : 'jpg');
  const thumbnailUrl = resourceType === 'video' ? getCloudinaryVideoThumbnail(secureUrl, data.public_id) : secureUrl;

  return {
    url: data.url,
    secureUrl,
    publicId: data.public_id,
    originalFilename: data.original_filename || fileName || (file instanceof File ? file.name : (isVideo ? 'video' : 'image')),
    format,
    bytes: data.bytes || 0,
    width: data.width,
    height: data.height,
    resourceType,
    duration: returnedDuration > 0 ? returnedDuration : undefined,
    thumbnailUrl
  };
};
