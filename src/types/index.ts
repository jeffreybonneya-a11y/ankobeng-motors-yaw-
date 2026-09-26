export interface ProductImage {
  url: string;
  publicId?: string;
  type?: 'image' | 'video';
  duration?: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  images: string[];
  imageDetails?: ProductImage[];
  videoUrl?: string;
  videoPublicId?: string;
  videoDuration?: number;
  description?: string;
  application?: string;
  specifications?: Record<string, string>;
  fitment?: string;
  condition?: string;
  availability: string;
  featured?: boolean;
  order?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  order?: number;
}

export interface EnquiryOrder {
  id: string;
  customerName: string;
  phone: string;
  email?: string;
  productId?: string;
  productName?: string;
  quantity: number;
  contactMethod: 'Phone Call' | 'WhatsApp Message' | 'In-Person Visit';
  message?: string;
  status: 'New' | 'Contacted' | 'Processing' | 'Completed' | 'Cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  image: string;
  publicId?: string;
  mediaType?: 'image' | 'video';
  videoUrl?: string;
  videoDuration?: number;
  description?: string;
  active: boolean;
  order?: number;
}

export interface BusinessInfo {
  name: string;
  owner: string;
  description: string;
  address: string;
  location: string;
  shopDoor: string;
  phones: string[];
}

export interface MediaItem {
  id: string;
  url: string;
  publicId?: string;
  originalFilename: string;
  format?: string;
  bytes?: number;
  width?: number;
  height?: number;
  mediaType?: 'image' | 'video';
  duration?: number; // duration in seconds (max 1min 30s / 90s)
  thumbnailUrl?: string;
  locationUsed?: string; // where this media is placed on the site
  createdAt: string;
}

export interface VideoPlacementConfig {
  id: string;
  name: string;
  location: string;
  enabled: boolean;
  videoUrl: string;
  publicId?: string;
  originalFilename?: string;
  duration?: number;
  posterUrl?: string;
  autoplay: boolean;
  muted: boolean;
  loop: boolean;
  controls: boolean;
}

export interface HomepageContent {
  heroHeadlinePrefix: string;
  heroHeadlineHighlight: string;
  heroHeadlineSuffix: string;
  heroLocationSubtitle: string;
  featuredTitle: string;
  featuredSubtitle: string;
  catalogueTitle: string;
  catalogueSubtitle: string;
  aboutHeadline: string;
  aboutDescription: string;
  ctaHeadline: string;
  ctaDescription: string;

  // Dedicated Homepage & Section Background Settings
  homepageBackgroundImage?: string;
  homepageBackgroundPublicId?: string;
  homepageBackgroundType?: 'image' | 'video';
  homepageBackgroundVideo?: string;
  homepageBackgroundVideoDuration?: number;
  homepageBackgroundVideoSettings?: {
    autoplay: boolean;
    muted: boolean;
    loop: boolean;
    controls: boolean;
  };

  // Section Video / Media Placements
  aboutMedia?: {
    enabled: boolean;
    type: 'image' | 'video';
    url: string;
    publicId?: string;
    posterUrl?: string;
    duration?: number;
    autoplay: boolean;
    muted: boolean;
    loop: boolean;
    controls: boolean;
  };

  heroMedia?: {
    enabled: boolean;
    type: 'image' | 'video';
    url: string;
    publicId?: string;
    posterUrl?: string;
    duration?: number;
    autoplay: boolean;
    muted: boolean;
    loop: boolean;
    controls: boolean;
  };

  featuredMedia?: {
    enabled: boolean;
    type: 'image' | 'video';
    url: string;
    publicId?: string;
    posterUrl?: string;
    duration?: number;
    autoplay: boolean;
    muted: boolean;
    loop: boolean;
    controls: boolean;
  };

  ctaMedia?: {
    enabled: boolean;
    type: 'image' | 'video';
    url: string;
    publicId?: string;
    posterUrl?: string;
    duration?: number;
    autoplay: boolean;
    muted: boolean;
    loop: boolean;
    controls: boolean;
  };

  videoPlacements?: VideoPlacementConfig[];
}

export interface WhatsAppSettings {
  phoneNumber: string;
  internationalNumber: string;
  messageTemplate: string;
  defaultMessage: string;
}
