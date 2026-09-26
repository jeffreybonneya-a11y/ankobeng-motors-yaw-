import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Plus, Edit2, Trash2, Check, Star, 
  Layers, Image as ImageIcon, Building, RefreshCw, Download, 
  Upload, Shield, LogOut, CheckCircle, 
  AlertCircle, FileUp, MessageSquare, LayoutDashboard, 
  Sliders, ArrowUp, ArrowDown, Copy, ExternalLink, Sparkles,
  Phone, Smartphone, Search, Film, Play, Video, Volume2, 
  VolumeX, RotateCcw, MonitorPlay, SlidersHorizontal, CheckSquare,
  User as UserIcon, Database, Cloud
} from 'lucide-react';
import { User } from 'firebase/auth';
import { 
  Product, 
  Category, 
  HeroSlide, 
  BusinessInfo, 
  MediaItem, 
  HomepageContent, 
  WhatsAppSettings,
  VideoPlacementConfig 
} from '../types';
import { 
  dataService, 
  cleanProductNameFromFileName, 
  STOREFRONT_IMAGE, 
  STOREFRONT_IMAGE_INTERIOR 
} from '../services/dataService';
import { 
  uploadToCloudinary, 
  CLOUDINARY_CONFIG, 
  MAX_VIDEO_DURATION_SECONDS, 
  isVideoFile, 
  getVideoDuration 
} from '../services/cloudinaryService';

interface AdminDashboardProps {
  products: Product[];
  categories: Category[];
  heroSlides: HeroSlide[];
  businessInfo: BusinessInfo;
  homepageContent: HomepageContent;
  whatsappSettings: WhatsAppSettings;
  mediaItems: MediaItem[];
  onClose: () => void;
  onDataChanged: () => void;
  isStandalonePage?: boolean;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  categories,
  heroSlides,
  businessInfo,
  homepageContent,
  whatsappSettings,
  mediaItems,
  onClose,
  onDataChanged,
  isStandalonePage = false
}) => {
  // Firebase Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(() => dataService.getCurrentUser());
  const [isAdminAuthorized, setIsAdminAuthorized] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState('');
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);

  // Tabs
  type TabKey = 
    | 'dashboard'
    | 'products'
    | 'categories'
    | 'featured'
    | 'hero'
    | 'homepage'
    | 'placements'
    | 'media'
    | 'business'
    | 'whatsapp';

  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');

  // Status banners & feedback
  const [actionSuccess, setActionSuccess] = useState<string>('');
  const [actionError, setActionError] = useState<string>('');
  const [isSavingToFirestore, setIsSavingToFirestore] = useState(false);
  
  const showFeedback = (msg: string, isError = false) => {
    if (isError) {
      setActionError(msg);
      setTimeout(() => setActionError(''), 6000);
    } else {
      setActionSuccess(msg);
      setTimeout(() => setActionSuccess(''), 3500);
    }
  };

  // Monitor Firebase Auth state
  useEffect(() => {
    const unsub = dataService.onAuthChange(async (user) => {
      setCurrentUser(user);
      if (user) {
        const isAdm = await dataService.isUserAdmin(user);
        setIsAdminAuthorized(isAdm);
        if (!isAdm) {
          setAuthError(`User ${user.email || user.uid} is not authorized as an administrator.`);
        }
      } else {
        setIsAdminAuthorized(false);
      }
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  // ----------------------------------------------------
  // PRODUCTS STATE
  // ----------------------------------------------------
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('ALL');
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [productForm, setProductForm] = useState<{
    id?: string;
    name: string;
    category: string;
    images: string[];
    imageDetails: { url: string; publicId?: string }[];
    videoUrl?: string;
    videoPublicId?: string;
    videoDuration?: number;
    fitment: string;
    condition: string;
    availability: string;
    description: string;
    application: string;
    featured: boolean;
  }>({
    name: '',
    category: 'Engines',
    images: [],
    imageDetails: [],
    videoUrl: '',
    fitment: '',
    condition: 'Shop Stock',
    availability: 'In Stock (Shop Door E-3)',
    description: '',
    application: '',
    featured: false
  });
  const [isUploadingToCloudinary, setIsUploadingToCloudinary] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState('');
  const [mediaPickerOpenFor, setMediaPickerOpenFor] = useState<'product' | 'product_video' | 'hero' | 'bg_image' | 'bg_video' | 'placement' | null>(null);
  const [activePlacementTarget, setActivePlacementTarget] = useState<string | null>(null);
  const productFileInputRef = useRef<HTMLInputElement>(null);
  const productVideoInputRef = useRef<HTMLInputElement>(null);

  // ----------------------------------------------------
  // CATEGORIES STATE
  // ----------------------------------------------------
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');

  // ----------------------------------------------------
  // HERO SLIDESHOW STATE
  // ----------------------------------------------------
  const [isEditingSlide, setIsEditingSlide] = useState(false);
  const [slideForm, setSlideForm] = useState<{
    id?: string;
    title: string;
    subtitle: string;
    badge: string;
    image: string;
    publicId?: string;
    mediaType?: 'image' | 'video';
    videoUrl?: string;
    videoDuration?: number;
    description: string;
    active: boolean;
  }>({
    title: '',
    subtitle: '',
    badge: 'SHOP DOOR E-3',
    image: '',
    mediaType: 'image',
    description: '',
    active: true
  });
  const heroFileInputRef = useRef<HTMLInputElement>(null);

  // ----------------------------------------------------
  // HOMEPAGE CONTENT & BACKGROUND STATE
  // ----------------------------------------------------
  const [homepageForm, setHomepageForm] = useState<HomepageContent>({ ...homepageContent });
  const bgImageInputRef = useRef<HTMLInputElement>(null);
  const bgVideoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setHomepageForm({ ...homepageContent });
  }, [homepageContent]);

  // ----------------------------------------------------
  // MEDIA LIBRARY (IMAGES & VIDEOS) STATE
  // ----------------------------------------------------
  const [mediaSearch, setMediaSearch] = useState('');
  const [mediaTypeFilter, setMediaTypeFilter] = useState<'all' | 'image' | 'video'>('all');
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [previewMediaModal, setPreviewMediaModal] = useState<MediaItem | null>(null);
  const mediaFileInputRef = useRef<HTMLInputElement>(null);

  // ----------------------------------------------------
  // BUSINESS INFORMATION STATE
  // ----------------------------------------------------
  const [businessForm, setBusinessForm] = useState<BusinessInfo>({ ...businessInfo });
  useEffect(() => {
    setBusinessForm({ ...businessInfo });
  }, [businessInfo]);

  // ----------------------------------------------------
  // WHATSAPP SETTINGS STATE
  // ----------------------------------------------------
  const [whatsappForm, setWhatsappForm] = useState<WhatsAppSettings>({ ...whatsappSettings });
  useEffect(() => {
    setWhatsappForm({ ...whatsappSettings });
  }, [whatsappSettings]);

  // ----------------------------------------------------
  // FIREBASE AUTHENTICATION HANDLERS (GOOGLE SIGN-IN ONLY)
  // ----------------------------------------------------
  const handleGoogleLogin = async () => {
    setAuthError('');
    setIsSubmittingAuth(true);
    try {
      await dataService.loginWithGoogle();
      showFeedback('Google sign-in successful.');
    } catch (err: any) {
      console.error('Google Sign-in error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setAuthError('Sign-in cancelled. Please complete the Google login prompt.');
      } else {
        setAuthError(err.message || 'Google sign-in encountered an error.');
      }
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  const handleLogout = async () => {
    try {
      await dataService.logoutAdmin();
      showFeedback('Signed out from Firebase Admin Portal.');
    } catch (err: any) {
      showFeedback(err.message || 'Error signing out', true);
    }
  };

  // ----------------------------------------------------
  // MEDIA UPLOAD TO CLOUDINARY + FIRESTORE METADATA
  // ----------------------------------------------------
  const handleUploadMediaFile = async (e: React.ChangeEvent<HTMLInputElement>, targetLocation?: string) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingMedia(true);
    setUploadProgressText('Uploading media asset to Cloudinary CDN...');

    try {
      let count = 0;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const isVid = isVideoFile(file);

        if (isVid) {
          setUploadProgressText(`Validating video ${file.name} (Strict 50s limit)...`);
          const duration = await getVideoDuration(file);
          if (duration > MAX_VIDEO_DURATION_SECONDS) {
            throw new Error(`Video "${file.name}" is ${Math.round(duration)}s long, which exceeds the strict 50-second maximum limit.`);
          }
          setUploadProgressText(`Uploading video "${file.name}" to Cloudinary...`);
        } else {
          setUploadProgressText(`Uploading image "${file.name}" to Cloudinary...`);
        }

        const res = await uploadToCloudinary(file, file.name);

        // Save metadata directly to Cloud Firestore collection 'media'
        await dataService.addMediaItem({
          url: res.secureUrl,
          publicId: res.publicId,
          originalFilename: res.originalFilename,
          format: res.format,
          bytes: res.bytes,
          width: res.width,
          height: res.height,
          mediaType: res.resourceType,
          duration: res.duration,
          thumbnailUrl: res.thumbnailUrl,
          locationUsed: targetLocation || 'Media Library'
        });
        count++;
      }

      showFeedback(`Successfully uploaded ${count} media asset(s) and saved to Firestore!`);
    } catch (err: any) {
      showFeedback(err.message || 'Upload failed.', true);
    } finally {
      setIsUploadingMedia(false);
      setUploadProgressText('');
      if (e.target) e.target.value = '';
    }
  };

  // ----------------------------------------------------
  // HOMEPAGE BACKGROUND UPLOAD
  // ----------------------------------------------------
  const handleUploadHomepageBg = async (e: React.ChangeEvent<HTMLInputElement>, isVideo = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingToCloudinary(true);
    setUploadProgressText(`Uploading homepage background ${isVideo ? 'video' : 'image'} to Cloudinary...`);

    try {
      if (isVideo) {
        const duration = await getVideoDuration(file);
        if (duration > MAX_VIDEO_DURATION_SECONDS) {
          throw new Error(`Background video duration is ${Math.round(duration)}s (Maximum allowed is strictly 50 seconds).`);
        }
      }

      const res = await uploadToCloudinary(file, file.name);

      // Save to media library in Firestore
      await dataService.addMediaItem({
        url: res.secureUrl,
        publicId: res.publicId,
        originalFilename: res.originalFilename,
        format: res.format,
        bytes: res.bytes,
        mediaType: res.resourceType,
        duration: res.duration,
        thumbnailUrl: res.thumbnailUrl,
        locationUsed: 'Homepage Background'
      });

      if (isVideo) {
        const updated: HomepageContent = {
          ...homepageForm,
          homepageBackgroundType: 'video',
          homepageBackgroundVideo: res.secureUrl,
          homepageBackgroundVideoDuration: res.duration
        };
        setHomepageForm(updated);
        await dataService.saveHomepageContent(updated);
        showFeedback('Uploaded and saved Homepage Background Video to Firestore!');
      } else {
        const updated: HomepageContent = {
          ...homepageForm,
          homepageBackgroundType: 'image',
          homepageBackgroundImage: res.secureUrl,
          homepageBackgroundPublicId: res.publicId
        };
        setHomepageForm(updated);
        await dataService.saveHomepageContent(updated);
        showFeedback('Uploaded and saved Homepage Background Image to Firestore!');
      }
    } catch (err: any) {
      showFeedback(err.message || 'Failed to upload background media.', true);
    } finally {
      setIsUploadingToCloudinary(false);
      setUploadProgressText('');
      if (e.target) e.target.value = '';
    }
  };

  // ----------------------------------------------------
  // PRODUCT IMAGE & VIDEO UPLOAD
  // ----------------------------------------------------
  const handleProductFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingToCloudinary(true);
    setUploadProgressText('Uploading product image(s) to Cloudinary...');

    try {
      const newImages: string[] = [...productForm.images];
      const newDetails = [...productForm.imageDetails];
      let inferredName = productForm.name;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Exact rule: If product name is empty and this is the first image, set name to file name without extension
        if (!inferredName.trim() && i === 0) {
          inferredName = cleanProductNameFromFileName(file.name);
        }

        const res = await uploadToCloudinary(file, file.name);
        newImages.push(res.secureUrl);
        newDetails.push({ url: res.secureUrl, publicId: res.publicId });

        // Save media metadata to Firestore
        await dataService.addMediaItem({
          url: res.secureUrl,
          publicId: res.publicId,
          originalFilename: res.originalFilename,
          format: res.format,
          bytes: res.bytes,
          mediaType: 'image',
          locationUsed: `Product: ${inferredName || 'New Product'}`
        });
      }

      setProductForm({
        ...productForm,
        name: inferredName,
        images: newImages,
        imageDetails: newDetails
      });

      showFeedback('Product images uploaded to Cloudinary successfully!');
    } catch (err: any) {
      showFeedback(err.message || 'Image upload failed.', true);
    } finally {
      setIsUploadingToCloudinary(false);
      setUploadProgressText('');
      if (e.target) e.target.value = '';
    }
  };

  // Product Video Upload (max 50s)
  const handleProductVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingToCloudinary(true);
    setUploadProgressText('Uploading product demonstration video (Max 50s)...');

    try {
      const duration = await getVideoDuration(file);
      if (duration > MAX_VIDEO_DURATION_SECONDS) {
        throw new Error(`Video is ${Math.round(duration)}s long. Maximum allowed is 50 seconds.`);
      }

      const res = await uploadToCloudinary(file, file.name);

      await dataService.addMediaItem({
        url: res.secureUrl,
        publicId: res.publicId,
        originalFilename: res.originalFilename,
        format: res.format,
        bytes: res.bytes,
        mediaType: 'video',
        duration: res.duration,
        thumbnailUrl: res.thumbnailUrl,
        locationUsed: `Product Video: ${productForm.name || 'Product'}`
      });

      setProductForm({
        ...productForm,
        videoUrl: res.secureUrl,
        videoPublicId: res.publicId,
        videoDuration: res.duration
      });

      showFeedback('Product video clip uploaded and attached!');
    } catch (err: any) {
      showFeedback(err.message || 'Video upload failed.', true);
    } finally {
      setIsUploadingToCloudinary(false);
      setUploadProgressText('');
      if (e.target) e.target.value = '';
    }
  };

  // Save / Update Product directly to Cloud Firestore
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name.trim()) {
      showFeedback('Please provide an exact product name.', true);
      return;
    }
    if (productForm.images.length === 0) {
      showFeedback('Please upload or select at least one product image.', true);
      return;
    }

    setIsSavingToFirestore(true);
    try {
      await dataService.saveProduct({
        id: productForm.id,
        name: productForm.name.trim(),
        category: productForm.category,
        images: productForm.images,
        imageDetails: productForm.imageDetails,
        videoUrl: productForm.videoUrl?.trim() || undefined,
        videoPublicId: productForm.videoPublicId?.trim() || undefined,
        videoDuration: productForm.videoDuration || undefined,
        fitment: productForm.fitment.trim(),
        condition: productForm.condition,
        availability: productForm.availability,
        description: productForm.description.trim(),
        application: productForm.application.trim(),
        featured: productForm.featured,
        order: products.length + 1
      });

      showFeedback(`Product "${productForm.name}" saved directly to Cloud Firestore!`);
      setIsEditingProduct(false);
    } catch (err: any) {
      showFeedback(err.message || 'Failed to save product to Firestore.', true);
    } finally {
      setIsSavingToFirestore(false);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" from Cloud Firestore?`)) return;
    try {
      await dataService.deleteProduct(id);
      showFeedback(`Product "${name}" deleted from Cloud Firestore.`);
    } catch (err: any) {
      showFeedback(err.message || 'Failed to delete product from Firestore.', true);
    }
  };

  // ----------------------------------------------------
  // HERO SLIDE UPLOAD & SAVE
  // ----------------------------------------------------
  const handleHeroFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingToCloudinary(true);
    setUploadProgressText('Uploading hero media to Cloudinary (Max 50s for video)...');

    try {
      const isVid = isVideoFile(file);
      if (isVid) {
        const duration = await getVideoDuration(file);
        if (duration > MAX_VIDEO_DURATION_SECONDS) {
          throw new Error(`Video is ${Math.round(duration)}s long (Max limit is 50 seconds).`);
        }
      }

      const res = await uploadToCloudinary(file, file.name);

      await dataService.addMediaItem({
        url: res.secureUrl,
        publicId: res.publicId,
        originalFilename: res.originalFilename,
        format: res.format,
        bytes: res.bytes,
        mediaType: res.resourceType,
        duration: res.duration,
        thumbnailUrl: res.thumbnailUrl,
        locationUsed: 'Hero Slideshow'
      });

      setSlideForm({
        ...slideForm,
        image: res.secureUrl,
        publicId: res.publicId,
        mediaType: res.resourceType,
        videoUrl: res.resourceType === 'video' ? res.secureUrl : undefined,
        videoDuration: res.duration
      });

      showFeedback('Hero media uploaded to Cloudinary successfully!');
    } catch (err: any) {
      showFeedback(err.message || 'Media upload failed.', true);
    } finally {
      setIsUploadingToCloudinary(false);
      setUploadProgressText('');
      if (e.target) e.target.value = '';
    }
  };

  const handleSaveHeroSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slideForm.title.trim()) {
      showFeedback('Please provide a slide title.', true);
      return;
    }
    if (!slideForm.image) {
      showFeedback('Please select or upload a slide image or video.', true);
      return;
    }

    setIsSavingToFirestore(true);
    try {
      const slideId = slideForm.id || `slide-${Date.now()}`;
      await dataService.saveHeroSlide({
        id: slideId,
        title: slideForm.title.trim(),
        subtitle: slideForm.subtitle.trim(),
        badge: slideForm.badge.trim() || 'SHOP DOOR E-3',
        image: slideForm.image,
        publicId: slideForm.publicId,
        mediaType: slideForm.mediaType || 'image',
        videoUrl: slideForm.videoUrl,
        videoDuration: slideForm.videoDuration,
        description: slideForm.description.trim(),
        active: slideForm.active,
        order: heroSlides.length + 1
      });
      showFeedback('Hero slide saved to Cloud Firestore!');
      setIsEditingSlide(false);
    } catch (err: any) {
      showFeedback(err.message || 'Failed to save slide to Firestore.', true);
    } finally {
      setIsSavingToFirestore(false);
    }
  };

  // ----------------------------------------------------
  // VIDEO PLACEMENTS SAVE
  // ----------------------------------------------------
  const handleSavePlacement = async (placement: VideoPlacementConfig) => {
    const placements = homepageForm.videoPlacements || [];
    const idx = placements.findIndex(p => p.id === placement.id);
    let updatedPlacements: VideoPlacementConfig[];
    if (idx !== -1) {
      updatedPlacements = [...placements];
      updatedPlacements[idx] = placement;
    } else {
      updatedPlacements = [...placements, placement];
    }

    const newHomepage: HomepageContent = { 
      ...homepageForm, 
      videoPlacements: updatedPlacements 
    };
    
    if (placement.id === 'homepage-bg') {
      newHomepage.homepageBackgroundType = placement.enabled && placement.videoUrl ? 'video' : 'image';
      newHomepage.homepageBackgroundVideo = placement.videoUrl;
      newHomepage.homepageBackgroundVideoSettings = {
        autoplay: placement.autoplay,
        muted: placement.muted,
        loop: placement.loop,
        controls: placement.controls
      };
    } else if (placement.id === 'about-section') {
      newHomepage.aboutMedia = {
        enabled: placement.enabled,
        type: 'video',
        url: placement.videoUrl,
        publicId: placement.publicId,
        posterUrl: placement.posterUrl,
        duration: placement.duration,
        autoplay: placement.autoplay,
        muted: placement.muted,
        loop: placement.loop,
        controls: placement.controls
      };
    }

    setHomepageForm(newHomepage);
    try {
      await dataService.saveHomepageContent(newHomepage);
      showFeedback(`Saved configuration for "${placement.name}" to Cloud Firestore!`);
    } catch (err: any) {
      showFeedback(err.message || 'Failed to update placement in Firestore.', true);
    }
  };

  // ----------------------------------------------------
  // 1. RENDER FIREBASE LOGIN SCREEN IF UNAUTHENTICATED
  // ----------------------------------------------------
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#080b14] flex items-center justify-center p-4">
        <div className="flex items-center gap-3 text-[#d4ff32] font-mono text-xs animate-pulse">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Verifying Firebase Authentication...</span>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#080b14] flex items-center justify-center p-4 selection:bg-[#d4ff32] selection:text-[#080b14]">
        <div className="w-full max-w-md bg-[#0d1222] border border-[#273153] rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-[#13192f] border border-[#d4ff32]/40 mx-auto flex items-center justify-center text-[#d4ff32] shadow-inner">
              <Shield className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-black uppercase text-white tracking-tight font-heading">
              STORE MANAGEMENT PORTAL
            </h2>
            <p className="text-xs font-mono text-slate-400">
              Official Administrator Access • Google Authentication
            </p>
          </div>

          {authError && (
            <div className="p-3 bg-red-950/60 border border-red-500/50 rounded-xl text-red-200 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{authError}</span>
            </div>
          )}

          <div className="space-y-3 font-mono text-xs">
            {/* Google Sign-in Only Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isSubmittingAuth}
              className="w-full py-3.5 px-4 bg-white hover:bg-slate-100 text-slate-900 rounded-xl font-sans text-sm font-semibold transition-all flex items-center justify-center gap-3 cursor-pointer shadow-lg active:scale-[0.99] disabled:opacity-50"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{isSubmittingAuth ? 'Signing in with Google...' : 'Sign in with Google'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 bg-[#13192f] hover:bg-[#18203d] border border-[#273153] text-slate-300 rounded-xl font-bold transition-colors cursor-pointer text-center"
            >
              Return to Store
            </button>
          </div>

          <div className="pt-4 border-t border-[#273153] text-center text-[10px] text-slate-400 font-mono">
            Authorized Administrator Access Only • Shop Door E-3
          </div>
        </div>
      </div>
    );
  }

  // Unauthorized access guard: Authenticated user is not an administrator
  if (!isAdminAuthorized) {
    return (
      <div className="min-h-screen bg-[#080b14] flex items-center justify-center p-4 selection:bg-[#d4ff32] selection:text-[#080b14]">
        <div className="w-full max-w-md bg-[#0d1222] border border-red-500/40 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-red-950/50 border border-red-500/50 mx-auto flex items-center justify-center text-red-400 shadow-inner">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-black uppercase text-white tracking-tight font-heading">
              ACCESS RESTRICTED
            </h2>
            <p className="text-xs font-mono text-red-300">
              Administrative Privileges Required
            </p>
          </div>

          <div className="p-4 bg-[#13192f] border border-[#273153] rounded-xl text-xs font-mono space-y-2 text-slate-300">
            <div className="flex items-center gap-2 text-slate-400">
              <UserIcon className="w-4 h-4 text-slate-400" />
              <span>Signed in with Google as:</span>
            </div>
            <div className="font-bold text-white break-all bg-[#080b14] p-2 rounded border border-[#273153]">
              {currentUser.email || currentUser.uid}
            </div>
            <p className="text-[11px] text-slate-400 pt-1 leading-relaxed">
              This Google account is not registered as an authorized administrator. All CMS modifications and Firestore operations are restricted by security rules.
            </p>
          </div>

          <div className="flex flex-col gap-3 font-mono text-xs">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full py-2.5 bg-red-950/60 hover:bg-red-900/60 border border-red-500/50 text-red-200 font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out &amp; Switch Account</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 bg-[#13192f] hover:bg-[#18203d] border border-[#273153] text-slate-300 font-bold rounded-lg transition-colors cursor-pointer"
            >
              Return to Storefront
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ====================================================
  // 2. RENDER AUTHENTICATED FIREBASE CMS DASHBOARD
  // ====================================================
  const wrapperClass = isStandalonePage
    ? "min-h-screen bg-[#080b14] text-slate-200 flex flex-col p-2 sm:p-4 selection:bg-[#d4ff32] selection:text-[#080b14]"
    : "fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto";

  const cardClass = isStandalonePage
    ? "relative w-full max-w-7xl mx-auto bg-[#0d1222] border border-[#273153] rounded-2xl overflow-hidden shadow-2xl flex flex-col flex-1 my-2"
    : "relative w-full max-w-6xl bg-[#0d1222] border border-[#273153] rounded-2xl overflow-hidden shadow-2xl my-4 max-h-[94vh] flex flex-col";

  const filteredMedia = mediaItems.filter(m => {
    const matchesSearch = !mediaSearch || m.originalFilename.toLowerCase().includes(mediaSearch.toLowerCase()) || (m.locationUsed && m.locationUsed.toLowerCase().includes(mediaSearch.toLowerCase()));
    const matchesType = mediaTypeFilter === 'all' || m.mediaType === mediaTypeFilter || (!m.mediaType && mediaTypeFilter === 'image');
    return matchesSearch && matchesType;
  });

  return (
    <div className={wrapperClass}>
      <div className={cardClass}>
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-[#13192f] border-b border-[#273153] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#d4ff32] animate-pulse"></span>
              <span className="text-[10px] font-mono text-[#d4ff32] uppercase font-bold tracking-widest flex items-center gap-1.5">
                <Database className="w-3 h-3" /> FIRESTORE CLOUD CMS • CLOUDINARY (zpzdjznd)
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black uppercase text-white font-heading">
              {businessInfo.name} — ADMIN DASHBOARD
            </h2>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-[#080b14] border border-[#273153] rounded text-slate-300 text-[11px]">
              <UserIcon className="w-3 h-3 text-[#d4ff32]" />
              <span className="truncate max-w-[150px]">{currentUser.email || 'Admin'}</span>
            </div>

            <button
              onClick={onClose}
              className="px-3 py-2 bg-[#0d1222] hover:bg-[#18203d] text-[#d4ff32] border border-[#273153] hover:border-[#d4ff32]/50 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Return to Public Storefront"
            >
              <span>&larr; View Storefront</span>
            </button>

            <button
              onClick={async () => {
                if (window.confirm('Sync & seed default catalog to Cloud Firestore? (Will safely merge without overwriting custom modifications)')) {
                  setIsSavingToFirestore(true);
                  try {
                    await dataService.seedInitialDataIfEmpty(true);
                    showFeedback('Catalog synchronized to Cloud Firestore.');
                  } catch (err: any) {
                    showFeedback(err.message || 'Sync failed', true);
                  } finally {
                    setIsSavingToFirestore(false);
                  }
                }
              }}
              className="p-2 text-slate-400 hover:text-emerald-300 bg-[#0d1222] rounded-lg border border-[#273153] transition-colors cursor-pointer"
              title="Sync / Seed Initial Data to Firestore"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={handleLogout}
              className="px-3 py-2 bg-[#0d1222] hover:bg-red-950/50 text-slate-400 hover:text-red-300 border border-[#273153] rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Log Out</span>
            </button>

            {!isStandalonePage && (
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white bg-[#0d1222] rounded-lg border border-[#273153] transition-colors cursor-pointer"
                title="Close Admin"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Global Feedback Banners */}
        {actionSuccess && (
          <div className="px-4 py-2.5 bg-emerald-950/90 border-b border-emerald-500/50 text-emerald-200 text-xs font-mono flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}
        {actionError && (
          <div className="px-4 py-2.5 bg-red-950/90 border-b border-red-500/50 text-red-200 text-xs font-mono flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{actionError}</span>
          </div>
        )}
        {uploadProgressText && (
          <div className="px-4 py-2.5 bg-[#d4ff32]/10 border-b border-[#d4ff32]/30 text-[#d4ff32] text-xs font-mono flex items-center gap-2 animate-pulse">
            <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
            <span>{uploadProgressText}</span>
          </div>
        )}
        {isSavingToFirestore && (
          <div className="px-4 py-2 bg-blue-950/90 border-b border-blue-500/50 text-blue-200 text-xs font-mono flex items-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-blue-400 shrink-0" />
            <span>Saving changes to Cloud Firestore...</span>
          </div>
        )}

        {/* CMS Navigation Tabs Bar */}
        <div className="bg-[#080b14] border-b border-[#273153] px-2 sm:px-4 flex overflow-x-auto shrink-0 scrollbar-none font-mono text-xs">
          {[
            { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { key: 'products', label: `Products (${products.length})`, icon: Layers },
            { key: 'categories', label: `Categories (${categories.length})`, icon: Sliders },
            { key: 'featured', label: `Featured (${products.filter(p => p.featured).length})`, icon: Star },
            { key: 'hero', label: `Hero Slides (${heroSlides.length})`, icon: Film },
            { key: 'homepage', label: 'Homepage & Background', icon: MonitorPlay },
            { key: 'placements', label: 'Video Placements', icon: Video },
            { key: 'media', label: `Media Library (${mediaItems.length})`, icon: ImageIcon },
            { key: 'business', label: 'Business Info', icon: Building },
            { key: 'whatsapp', label: 'WhatsApp', icon: MessageSquare }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as TabKey)}
                className={`py-3 px-3.5 sm:px-4 font-bold whitespace-nowrap border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? 'border-[#d4ff32] text-[#d4ff32] bg-[#13192f]/60'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#13192f]/30'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* ==================================================== */}
          {/* TAB 1: DASHBOARD METRICS & CLOUD OVERVIEW */}
          {/* ==================================================== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 font-mono text-xs">
              {/* Metrics Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-[#13192f] rounded-xl border border-[#273153]">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Total Products</span>
                  <div className="text-2xl font-black text-white">{products.length}</div>
                  <span className="text-[#d4ff32] text-[10px] mt-1 block">Live in Firestore</span>
                </div>
                <div className="p-4 bg-[#13192f] rounded-xl border border-[#273153]">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Featured Items</span>
                  <div className="text-2xl font-black text-[#d4ff32]">{products.filter(p => p.featured).length}</div>
                  <span className="text-slate-400 text-[10px] mt-1 block">Homepage Spotlight</span>
                </div>
                <div className="p-4 bg-[#13192f] rounded-xl border border-[#273153]">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Media Assets</span>
                  <div className="text-2xl font-black text-white">{mediaItems.length}</div>
                  <span className="text-slate-400 text-[10px] mt-1 block">
                    {mediaItems.filter(m => m.mediaType === 'video').length} Videos • {mediaItems.filter(m => m.mediaType !== 'video').length} Images
                  </span>
                </div>
                <div className="p-4 bg-[#13192f] rounded-xl border border-[#273153]">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Cloud Firestore</span>
                  <div className="text-emerald-400 font-black text-sm flex items-center gap-1.5 mt-1">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>CONNECTED</span>
                  </div>
                  <span className="text-slate-400 text-[10px] mt-1 block font-mono">Shared globally</span>
                </div>
              </div>

              {/* Cloudinary & Firestore Info Card */}
              <div className="p-5 bg-[#13192f] rounded-2xl border border-[#273153] space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#d4ff32]" />
                    <h3 className="text-sm font-bold text-white uppercase">Production Cloud Architecture</h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
                    FIREBASE + CLOUDINARY ACTIVE
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-[#080b14] rounded-xl border border-[#273153] text-[11px]">
                  <div>
                    <span className="text-slate-500 block uppercase text-[10px]">Cloudinary Cloud Name:</span>
                    <span className="text-white font-bold">{CLOUDINARY_CONFIG.cloudName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block uppercase text-[10px]">Upload Preset:</span>
                    <span className="text-[#d4ff32] font-bold">{CLOUDINARY_CONFIG.uploadPreset}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block uppercase text-[10px]">Max Video Length:</span>
                    <span className="text-white font-bold">{MAX_VIDEO_DURATION_SECONDS}s (Strict 50s Limit)</span>
                  </div>
                </div>
                <p className="text-slate-400 text-[11px]">
                  All catalog updates, product additions, background media, and WhatsApp settings save directly to Cloud Firestore. Changes are instantly reflected for all public visitors across phones and computers without rebuilding the site.
                </p>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  onClick={() => {
                    setActiveTab('products');
                    setIsEditingProduct(true);
                    setProductForm({
                      name: '',
                      category: 'Engines',
                      images: [],
                      imageDetails: [],
                      fitment: '',
                      condition: 'Shop Stock',
                      availability: 'In Stock (Shop Door E-3)',
                      description: '',
                      application: '',
                      featured: false
                    });
                  }}
                  className="p-4 bg-[#13192f] hover:bg-[#18203d] border border-[#273153] hover:border-[#d4ff32]/50 rounded-xl text-left transition-colors cursor-pointer group"
                >
                  <Plus className="w-5 h-5 text-[#d4ff32] mb-2 group-hover:scale-110 transition-transform" />
                  <span className="block text-white font-bold text-sm">Add New Product</span>
                  <span className="text-slate-400 text-[11px]">Upload engine or part with image/video</span>
                </button>

                <button
                  onClick={() => setActiveTab('homepage')}
                  className="p-4 bg-[#13192f] hover:bg-[#18203d] border border-[#273153] hover:border-[#d4ff32]/50 rounded-xl text-left transition-colors cursor-pointer group"
                >
                  <MonitorPlay className="w-5 h-5 text-[#d4ff32] mb-2 group-hover:scale-110 transition-transform" />
                  <span className="block text-white font-bold text-sm">Homepage Background</span>
                  <span className="text-slate-400 text-[11px]">Upload &amp; set custom background image/video</span>
                </button>

                <button
                  onClick={() => setActiveTab('media')}
                  className="p-4 bg-[#13192f] hover:bg-[#18203d] border border-[#273153] hover:border-[#d4ff32]/50 rounded-xl text-left transition-colors cursor-pointer group"
                >
                  <Film className="w-5 h-5 text-[#d4ff32] mb-2 group-hover:scale-110 transition-transform" />
                  <span className="block text-white font-bold text-sm">Upload Video (Max 50s)</span>
                  <span className="text-slate-400 text-[11px]">Upload shop tour or engine test clips</span>
                </button>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 2: PRODUCTS MANAGEMENT (FIRESTORE SYNCED) */}
          {/* ==================================================== */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              {!isEditingProduct ? (
                <>
                  {/* Products Toolbar */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 font-mono text-xs">
                    <div className="flex items-center gap-2 flex-1 max-w-md">
                      <div className="relative flex-1">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={productSearch}
                          onChange={(e) => setProductSearch(e.target.value)}
                          placeholder="Search products..."
                          className="w-full pl-9 pr-3 py-2 bg-[#13192f] border border-[#273153] focus:border-[#d4ff32] rounded-lg text-white outline-none"
                        />
                      </div>
                      <select
                        value={productCategoryFilter}
                        onChange={(e) => setProductCategoryFilter(e.target.value)}
                        className="bg-[#13192f] border border-[#273153] rounded-lg px-3 py-2 text-white outline-none"
                      >
                        <option value="ALL">All Categories</option>
                        {categories.map(c => (
                          <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={() => {
                        setIsEditingProduct(true);
                        setProductForm({
                          name: '',
                          category: categories[0]?.name || 'Engines',
                          images: [],
                          imageDetails: [],
                          fitment: '',
                          condition: 'Shop Stock',
                          availability: 'In Stock (Shop Door E-3)',
                          description: '',
                          application: '',
                          featured: false
                        });
                      }}
                      className="px-4 py-2 bg-[#d4ff32] hover:bg-[#c1ec25] text-[#080b14] font-bold uppercase rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Product</span>
                    </button>
                  </div>

                  {/* Products Table */}
                  <div className="bg-[#13192f] rounded-2xl border border-[#273153] overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left font-mono text-xs">
                        <thead className="bg-[#080b14] border-b border-[#273153] text-slate-400 uppercase text-[10px]">
                          <tr>
                            <th className="p-3">Product Specimen</th>
                            <th className="p-3">Exact Name</th>
                            <th className="p-3">Category</th>
                            <th className="p-3">Media</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Featured</th>
                            <th className="p-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#273153]">
                          {products
                            .filter(p => {
                              const matchesSearch = !productSearch || p.name.toLowerCase().includes(productSearch.toLowerCase());
                              const matchesCat = productCategoryFilter === 'ALL' || p.category === productCategoryFilter;
                              return matchesSearch && matchesCat;
                            })
                            .map((prod) => (
                              <tr key={prod.id} className="hover:bg-[#18203d]/50 transition-colors">
                                <td className="p-3">
                                  <div className="w-14 h-11 rounded-lg bg-black overflow-hidden border border-[#273153] flex items-center justify-center shrink-0">
                                    {prod.images[0] ? (
                                      <img src={prod.images[0]} alt={prod.name} className="w-full h-full object-cover" />
                                    ) : (
                                      <ImageIcon className="w-4 h-4 text-slate-600" />
                                    )}
                                  </div>
                                </td>
                                <td className="p-3 font-bold text-white">
                                  {prod.name}
                                </td>
                                <td className="p-3 text-[#d4ff32]">
                                  {prod.category}
                                </td>
                                <td className="p-3 text-slate-300">
                                  <div className="flex items-center gap-2">
                                    <span>{prod.images.length} img</span>
                                    {prod.videoUrl && (
                                      <span className="px-1.5 py-0.5 rounded bg-[#d4ff32]/20 text-[#d4ff32] text-[10px] flex items-center gap-0.5 font-bold">
                                        <Play className="w-2.5 h-2.5 fill-current" /> Vid {prod.videoDuration ? `(${Math.round(prod.videoDuration)}s)` : ''}
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="p-3">
                                  <span className="px-2 py-0.5 rounded bg-[#080b14] text-slate-300 text-[10px] border border-[#273153]">
                                    {prod.availability}
                                  </span>
                                </td>
                                <td className="p-3">
                                  <button
                                    onClick={async () => {
                                      await dataService.saveProduct({ ...prod, featured: !prod.featured });
                                      showFeedback(`Toggled featured status for ${prod.name}`);
                                    }}
                                    className={`p-1.5 rounded transition-colors cursor-pointer ${
                                      prod.featured ? 'text-[#d4ff32] bg-[#d4ff32]/10' : 'text-slate-600 hover:text-slate-400'
                                    }`}
                                    title={prod.featured ? 'Featured on Homepage' : 'Not Featured'}
                                  >
                                    <Star className={`w-4 h-4 ${prod.featured ? 'fill-current' : ''}`} />
                                  </button>
                                </td>
                                <td className="p-3 text-right space-x-2">
                                  <button
                                    onClick={() => {
                                      setIsEditingProduct(true);
                                      setProductForm({
                                        id: prod.id,
                                        name: prod.name,
                                        category: prod.category,
                                        images: prod.images || [],
                                        imageDetails: prod.imageDetails || [],
                                        videoUrl: prod.videoUrl || '',
                                        videoPublicId: prod.videoPublicId,
                                        videoDuration: prod.videoDuration,
                                        fitment: prod.fitment || '',
                                        condition: prod.condition || 'Shop Stock',
                                        availability: prod.availability || 'In Stock (Shop Door E-3)',
                                        description: prod.description || '',
                                        application: prod.application || '',
                                        featured: !!prod.featured
                                      });
                                    }}
                                    className="p-1.5 text-slate-400 hover:text-white bg-[#080b14] rounded border border-[#273153] transition-colors cursor-pointer"
                                    title="Edit Product"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProduct(prod.id, prod.name)}
                                    className="p-1.5 text-slate-400 hover:text-red-400 bg-[#080b14] rounded border border-[#273153] transition-colors cursor-pointer"
                                    title="Delete Product"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              ) : (
                /* Edit / Add Product Form */
                <form onSubmit={handleSaveProduct} className="p-5 bg-[#13192f] rounded-2xl border border-[#273153] space-y-6 font-mono text-xs">
                  <div className="flex items-center justify-between border-b border-[#273153] pb-4">
                    <h3 className="text-base font-bold text-white uppercase flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#d4ff32]" />
                      <span>{productForm.id ? `Edit Product: ${productForm.name}` : 'Add New Product'}</span>
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsEditingProduct(false)}
                      className="text-slate-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Hidden File Inputs for Direct Upload */}
                  <input
                    type="file"
                    ref={productFileInputRef}
                    onChange={handleProductFileUpload}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />
                  <input
                    type="file"
                    ref={productVideoInputRef}
                    onChange={handleProductVideoUpload}
                    accept="video/*"
                    className="hidden"
                  />

                  {/* Image Upload Zone */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-slate-300 font-bold uppercase text-[11px] block">
                        Product Images ({productForm.images.length})
                      </label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => productFileInputRef.current?.click()}
                          disabled={isUploadingToCloudinary}
                          className="px-3 py-1.5 bg-[#d4ff32] hover:bg-[#c1ec25] text-[#080b14] font-bold rounded flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload from Local PC</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => productVideoInputRef.current?.click()}
                          disabled={isUploadingToCloudinary}
                          className="px-3 py-1.5 bg-[#080b14] hover:bg-[#18203d] text-slate-300 border border-[#273153] font-bold rounded flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          <Film className="w-3.5 h-3.5 text-[#d4ff32]" />
                          <span>Upload Video (Max 50s)</span>
                        </button>
                      </div>
                    </div>

                    {/* Image Thumbnails & Video Display */}
                    <div className="flex flex-wrap gap-3 p-3 bg-[#080b14] rounded-xl border border-[#273153] min-h-[90px] items-center">
                      {productForm.images.length === 0 && !productForm.videoUrl && (
                        <p className="text-slate-500 text-[11px]">No media attached yet. Upload images or a short video from your local computer.</p>
                      )}

                      {productForm.images.map((imgUrl, idx) => (
                        <div key={idx} className="relative w-24 h-20 rounded-lg overflow-hidden border border-[#273153] group bg-black shrink-0">
                          <img src={imgUrl} alt={`Product ${idx + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => {
                              const newImages = productForm.images.filter((_, i) => i !== idx);
                              const newDetails = productForm.imageDetails.filter((_, i) => i !== idx);
                              setProductForm({ ...productForm, images: newImages, imageDetails: newDetails });
                            }}
                            className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            title="Remove Image"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}

                      {productForm.videoUrl && (
                        <div className="relative w-36 h-20 rounded-lg overflow-hidden border-2 border-[#d4ff32] bg-black group shrink-0 flex items-center justify-center">
                          <video src={productForm.videoUrl} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none">
                            <Play className="w-6 h-6 text-[#d4ff32]" />
                          </div>
                          <button
                            type="button"
                            onClick={() => setProductForm({ ...productForm, videoUrl: '', videoPublicId: undefined, videoDuration: undefined })}
                            className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded cursor-pointer z-10"
                            title="Remove Video"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Form Fields Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 font-bold uppercase mb-1">
                        Exact Product Name:
                      </label>
                      <input
                        type="text"
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        placeholder="e.g. OPEL 1.6 or ASTRA G"
                        className="w-full bg-[#080b14] border border-[#273153] focus:border-[#d4ff32] rounded-lg px-3 py-2 text-white outline-none font-bold"
                        required
                      />
                      <span className="text-[10px] text-slate-500 mt-1 block">
                        Auto-assigned from uploaded file name without extension.
                      </span>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold uppercase mb-1">
                        Category:
                      </label>
                      <select
                        value={productForm.category}
                        onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                        className="w-full bg-[#080b14] border border-[#273153] focus:border-[#d4ff32] rounded-lg px-3 py-2 text-white outline-none"
                      >
                        {categories.map(c => (
                          <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold uppercase mb-1">
                        Fitment / Compatibility:
                      </label>
                      <input
                        type="text"
                        value={productForm.fitment}
                        onChange={(e) => setProductForm({ ...productForm, fitment: e.target.value })}
                        placeholder="e.g. Opel Astra, Vectra A, Zafira"
                        className="w-full bg-[#080b14] border border-[#273153] focus:border-[#d4ff32] rounded-lg px-3 py-2 text-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold uppercase mb-1">
                        Availability Status:
                      </label>
                      <input
                        type="text"
                        value={productForm.availability}
                        onChange={(e) => setProductForm({ ...productForm, availability: e.target.value })}
                        placeholder="e.g. In Stock (Shop Door E-3)"
                        className="w-full bg-[#080b14] border border-[#273153] focus:border-[#d4ff32] rounded-lg px-3 py-2 text-white outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold uppercase mb-1">
                      Description:
                    </label>
                    <textarea
                      rows={3}
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      placeholder="Product details, condition, components included..."
                      className="w-full bg-[#080b14] border border-[#273153] focus:border-[#d4ff32] rounded-lg p-3 text-white outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-bold">
                      <input
                        type="checkbox"
                        checked={productForm.featured}
                        onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                        className="rounded border-[#273153] bg-[#080b14] text-[#d4ff32] focus:ring-0 w-4 h-4"
                      />
                      <span>Feature this product in the Homepage Spotlight</span>
                    </label>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#273153]">
                    <button
                      type="button"
                      onClick={() => setIsEditingProduct(false)}
                      className="px-4 py-2 bg-[#080b14] hover:bg-[#18203d] text-slate-300 rounded-lg transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSavingToFirestore}
                      className="px-6 py-2 bg-[#d4ff32] hover:bg-[#c1ec25] text-[#080b14] font-extrabold uppercase rounded-lg transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
                    >
                      <Check className="w-4 h-4" />
                      <span>{isSavingToFirestore ? 'Saving to Firestore...' : 'Save Product to Firestore'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 3: CATEGORIES MANAGEMENT */}
          {/* ==================================================== */}
          {activeTab === 'categories' && (
            <div className="space-y-6 font-mono text-xs max-w-2xl">
              <div className="p-5 bg-[#13192f] rounded-2xl border border-[#273153] space-y-4">
                <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#d4ff32]" />
                  <span>Manage Product Categories</span>
                </h3>

                {/* Add Category */}
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!newCategoryName.trim()) return;
                    setIsSavingToFirestore(true);
                    try {
                      const id = `cat-${Date.now()}`;
                      const slug = newCategoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                      await dataService.saveCategory({
                        id,
                        name: newCategoryName.trim(),
                        slug,
                        order: categories.length + 1
                      });
                      setNewCategoryName('');
                      showFeedback(`Category "${newCategoryName}" saved to Firestore!`);
                    } catch (err: any) {
                      showFeedback(err.message || 'Error saving category', true);
                    } finally {
                      setIsSavingToFirestore(false);
                    }
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="New category name (e.g. Gearboxes)"
                    className="flex-1 bg-[#080b14] border border-[#273153] focus:border-[#d4ff32] rounded-lg px-3 py-2 text-white outline-none"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isSavingToFirestore}
                    className="px-4 py-2 bg-[#d4ff32] hover:bg-[#c1ec25] text-[#080b14] font-bold uppercase rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add</span>
                  </button>
                </form>

                {/* Categories List */}
                <div className="space-y-2 pt-2">
                  {categories.map((cat) => (
                    <div key={cat.id} className="flex items-center justify-between p-3 bg-[#080b14] rounded-xl border border-[#273153]">
                      {editingCategoryId === cat.id ? (
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            type="text"
                            value={editingCategoryName}
                            onChange={(e) => setEditingCategoryName(e.target.value)}
                            className="bg-[#13192f] border border-[#d4ff32] rounded px-2.5 py-1 text-white outline-none flex-1"
                          />
                          <button
                            type="button"
                            onClick={async () => {
                              await dataService.saveCategory({ ...cat, name: editingCategoryName });
                              setEditingCategoryId(null);
                              showFeedback('Category updated in Firestore.');
                            }}
                            className="px-2.5 py-1 bg-[#d4ff32] text-[#080b14] rounded font-bold"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingCategoryId(null)}
                            className="px-2 py-1 text-slate-400"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <>
                          <div>
                            <span className="text-white font-bold block">{cat.name}</span>
                            <span className="text-slate-500 text-[10px]">Slug: {cat.slug}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingCategoryId(cat.id);
                                setEditingCategoryName(cat.name);
                              }}
                              className="p-1.5 text-slate-400 hover:text-white bg-[#13192f] rounded border border-[#273153]"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={async () => {
                                if (window.confirm(`Delete category "${cat.name}"?`)) {
                                  await dataService.deleteCategory(cat.id);
                                  showFeedback('Category deleted from Firestore.');
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-red-400 bg-[#13192f] rounded border border-[#273153]"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 4: FEATURED SPOTLIGHT ITEMS */}
          {/* ==================================================== */}
          {activeTab === 'featured' && (
            <div className="space-y-6 font-mono text-xs">
              <div className="p-5 bg-[#13192f] rounded-2xl border border-[#273153] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                      <Star className="w-4 h-4 text-[#d4ff32] fill-current" />
                      <span>Featured Engines &amp; Powertrains</span>
                    </h3>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      Items marked here appear in the prominent top Featured Spotlight section.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                  {products.map((prod) => (
                    <div
                      key={prod.id}
                      className={`p-3.5 rounded-xl border transition-all ${
                        prod.featured
                          ? 'bg-[#080b14] border-[#d4ff32]/60 shadow-lg'
                          : 'bg-[#080b14]/50 border-[#273153] opacity-70'
                      }`}
                    >
                      <div className="flex gap-3 items-center">
                        <div className="w-14 h-14 rounded-lg bg-black overflow-hidden border border-[#273153] shrink-0">
                          {prod.images[0] ? (
                            <img src={prod.images[0]} alt={prod.name} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-4 h-4 m-auto text-slate-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-bold text-white block truncate">{prod.name}</span>
                          <span className="text-slate-400 text-[10px] block">{prod.category}</span>
                        </div>
                        <button
                          type="button"
                          onClick={async () => {
                            await dataService.saveProduct({ ...prod, featured: !prod.featured });
                            showFeedback(`Updated featured status for "${prod.name}" in Firestore.`);
                          }}
                          className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                            prod.featured
                              ? 'bg-[#d4ff32] text-[#080b14] border-[#d4ff32]'
                              : 'bg-[#13192f] text-slate-400 border-[#273153] hover:text-white'
                          }`}
                          title={prod.featured ? 'Remove from Spotlight' : 'Add to Spotlight'}
                        >
                          <Star className={`w-4 h-4 ${prod.featured ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 5: HERO SLIDESHOW (IMAGES + VIDEOS) */}
          {/* ==================================================== */}
          {activeTab === 'hero' && (
            <div className="space-y-6 font-mono text-xs">
              {!isEditingSlide ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                        <Film className="w-4 h-4 text-[#d4ff32]" />
                        <span>Hero Carousel Slides</span>
                      </h3>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        Manage slides displayed in the top header slideshow (supports images &amp; short video clips).
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingSlide(true);
                        setSlideForm({
                          title: '',
                          subtitle: 'ABOSSEY OKAI STOCK',
                          badge: 'SHOP DOOR E-3',
                          image: '',
                          mediaType: 'image',
                          description: '',
                          active: true
                        });
                      }}
                      className="px-4 py-2 bg-[#d4ff32] hover:bg-[#c1ec25] text-[#080b14] font-bold uppercase rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Slide</span>
                    </button>
                  </div>

                  {/* Slides Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {heroSlides.map((slide, idx) => (
                      <div key={slide.id} className="p-4 bg-[#13192f] rounded-2xl border border-[#273153] space-y-3">
                        <div className="aspect-[16/10] rounded-xl overflow-hidden bg-black border border-[#273153] relative">
                          {slide.mediaType === 'video' || slide.videoUrl ? (
                            <video src={slide.videoUrl || slide.image} className="w-full h-full object-cover" />
                          ) : (
                            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                          )}
                          <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#d4ff32] text-[#080b14] font-bold text-[9px] uppercase">
                            Slide {idx + 1}
                          </span>
                        </div>

                        <div>
                          <span className="font-bold text-white text-sm block truncate">{slide.title}</span>
                          <span className="text-slate-400 text-[11px] block">{slide.subtitle}</span>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-[#273153]">
                          <label className="flex items-center gap-1.5 cursor-pointer text-slate-400 text-[11px]">
                            <input
                              type="checkbox"
                              checked={slide.active}
                              onChange={async (e) => {
                                await dataService.saveHeroSlide({ ...slide, active: e.target.checked });
                                showFeedback('Updated slide status in Firestore.');
                              }}
                              className="rounded border-[#273153] bg-[#080b14] text-[#d4ff32] focus:ring-0"
                            />
                            <span>Active</span>
                          </label>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setIsEditingSlide(true);
                                setSlideForm({
                                  id: slide.id,
                                  title: slide.title,
                                  subtitle: slide.subtitle,
                                  badge: slide.badge,
                                  image: slide.image,
                                  publicId: slide.publicId,
                                  mediaType: slide.mediaType || 'image',
                                  videoUrl: slide.videoUrl,
                                  videoDuration: slide.videoDuration,
                                  description: slide.description || '',
                                  active: slide.active
                                });
                              }}
                              className="p-1.5 text-slate-400 hover:text-white bg-[#080b14] rounded border border-[#273153]"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={async () => {
                                if (window.confirm('Delete this slide from Firestore?')) {
                                  await dataService.deleteHeroSlide(slide.id);
                                  showFeedback('Hero slide deleted from Firestore.');
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-red-400 bg-[#080b14] rounded border border-[#273153]"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Edit Slide Form */
                <form onSubmit={handleSaveHeroSlide} className="p-5 bg-[#13192f] rounded-2xl border border-[#273153] space-y-4 max-w-xl">
                  <div className="flex items-center justify-between border-b border-[#273153] pb-3">
                    <h3 className="font-bold text-white uppercase">{slideForm.id ? 'Edit Hero Slide' : 'Add Hero Slide'}</h3>
                    <button type="button" onClick={() => setIsEditingSlide(false)} className="text-slate-400"><X className="w-5 h-5" /></button>
                  </div>

                  <input type="file" ref={heroFileInputRef} onChange={handleHeroFileUpload} accept="image/*,video/*" className="hidden" />

                  <div>
                    <label className="block text-slate-300 font-bold uppercase mb-1">Slide Media:</label>
                    <div className="flex gap-3 items-center">
                      <div className="w-28 h-20 rounded-lg overflow-hidden bg-black border border-[#273153] shrink-0">
                        {slideForm.image ? (
                          slideForm.mediaType === 'video' || slideForm.videoUrl ? (
                            <video src={slideForm.videoUrl || slideForm.image} className="w-full h-full object-cover" />
                          ) : (
                            <img src={slideForm.image} alt="Slide Preview" className="w-full h-full object-cover" />
                          )
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-600"><ImageIcon className="w-6 h-6" /></div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => heroFileInputRef.current?.click()}
                        className="px-4 py-2 bg-[#d4ff32] hover:bg-[#c1ec25] text-[#080b14] font-bold rounded-lg flex items-center gap-1.5 cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload from Computer (Image/Video)</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold uppercase mb-1">Slide Title:</label>
                    <input
                      type="text"
                      value={slideForm.title}
                      onChange={(e) => setSlideForm({ ...slideForm, title: e.target.value })}
                      placeholder="e.g. OPEL POWERTRAIN SPECIALISTS"
                      className="w-full bg-[#080b14] border border-[#273153] rounded-lg px-3 py-2 text-white outline-none font-bold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold uppercase mb-1">Subtitle:</label>
                    <input
                      type="text"
                      value={slideForm.subtitle}
                      onChange={(e) => setSlideForm({ ...slideForm, subtitle: e.target.value })}
                      placeholder="e.g. ABOSSEY OKAI STOCK"
                      className="w-full bg-[#080b14] border border-[#273153] rounded-lg px-3 py-2 text-white outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#273153]">
                    <button type="button" onClick={() => setIsEditingSlide(false)} className="px-4 py-2 bg-[#080b14] text-slate-300 rounded-lg">Cancel</button>
                    <button type="submit" disabled={isSavingToFirestore} className="px-5 py-2 bg-[#d4ff32] text-[#080b14] font-bold uppercase rounded-lg">
                      {isSavingToFirestore ? 'Saving...' : 'Save Slide to Firestore'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 6: HOMEPAGE BACKGROUND & HEADLINES */}
          {/* ==================================================== */}
          {activeTab === 'homepage' && (
            <div className="space-y-6 font-mono text-xs">
              {/* Dedicated Homepage Background Image / Video Section */}
              <div className="p-5 bg-[#13192f] rounded-2xl border border-[#273153] space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                      <MonitorPlay className="w-4 h-4 text-[#d4ff32]" />
                      <span>Homepage Background Image / Video</span>
                    </h3>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      Upload and immediately use a custom high-resolution background or ambient video clip for the storefront.
                    </p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded bg-[#080b14] text-slate-300 border border-[#273153] text-[10px]">
                    Current Type: <strong className="text-[#d4ff32] uppercase">{homepageForm.homepageBackgroundType || 'image'}</strong>
                  </span>
                </div>

                <input type="file" ref={bgImageInputRef} onChange={(e) => handleUploadHomepageBg(e, false)} accept="image/*" className="hidden" />
                <input type="file" ref={bgVideoInputRef} onChange={(e) => handleUploadHomepageBg(e, true)} accept="video/*" className="hidden" />

                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center p-4 bg-[#080b14] rounded-xl border border-[#273153]">
                  <div className="md:col-span-5 aspect-video rounded-lg overflow-hidden bg-black border border-[#273153] relative">
                    {homepageForm.homepageBackgroundType === 'video' && homepageForm.homepageBackgroundVideo ? (
                      <video src={homepageForm.homepageBackgroundVideo} autoPlay muted loop className="w-full h-full object-cover" />
                    ) : (
                      <img src={homepageForm.homepageBackgroundImage || STOREFRONT_IMAGE} alt="Homepage Background" className="w-full h-full object-cover" />
                    )}
                  </div>

                  <div className="md:col-span-7 space-y-3">
                    <p className="text-slate-300 text-xs leading-relaxed">
                      Upload from your local computer. The uploaded file is stored in Cloudinary and immediately synced to Cloud Firestore as the global homepage backdrop.
                    </p>

                    <div className="flex flex-wrap gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => bgImageInputRef.current?.click()}
                        disabled={isUploadingToCloudinary}
                        className="px-4 py-2 bg-[#d4ff32] hover:bg-[#c1ec25] text-[#080b14] font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Background Image</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => bgVideoInputRef.current?.click()}
                        disabled={isUploadingToCloudinary}
                        className="px-4 py-2 bg-[#13192f] hover:bg-[#18203d] text-slate-200 border border-[#273153] font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Film className="w-3.5 h-3.5 text-[#d4ff32]" />
                        <span>Upload Background Video (Max 50s)</span>
                      </button>

                      <button
                        type="button"
                        onClick={async () => {
                          const updated: HomepageContent = {
                            ...homepageForm,
                            homepageBackgroundType: 'image',
                            homepageBackgroundImage: STOREFRONT_IMAGE,
                            homepageBackgroundVideo: ''
                          };
                          setHomepageForm(updated);
                          await dataService.saveHomepageContent(updated);
                          showFeedback('Restored original Abossey Okai storefront photo.');
                        }}
                        className="px-3 py-2 bg-[#080b14] hover:bg-[#18203d] text-slate-400 hover:text-white border border-[#273153] rounded-lg transition-colors cursor-pointer"
                        title="Restore Default Storefront Background"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Homepage Headlines & Content Form */}
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setIsSavingToFirestore(true);
                  try {
                    await dataService.saveHomepageContent(homepageForm);
                    showFeedback('Homepage headlines & section text saved to Cloud Firestore!');
                  } catch (err: any) {
                    showFeedback(err.message || 'Failed to save homepage content', true);
                  } finally {
                    setIsSavingToFirestore(false);
                  }
                }}
                className="p-5 bg-[#13192f] rounded-2xl border border-[#273153] space-y-4"
              >
                <h3 className="text-sm font-bold text-white uppercase">Section Headlines &amp; Descriptions</h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-400 uppercase text-[10px] font-bold mb-1">Hero Prefix</label>
                    <input
                      type="text"
                      value={homepageForm.heroHeadlinePrefix || ''}
                      onChange={(e) => setHomepageForm({ ...homepageForm, heroHeadlinePrefix: e.target.value })}
                      className="w-full bg-[#080b14] border border-[#273153] rounded p-2 text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 uppercase text-[10px] font-bold mb-1">Highlight (Lime)</label>
                    <input
                      type="text"
                      value={homepageForm.heroHeadlineHighlight || ''}
                      onChange={(e) => setHomepageForm({ ...homepageForm, heroHeadlineHighlight: e.target.value })}
                      className="w-full bg-[#080b14] border border-[#273153] rounded p-2 text-[#d4ff32] font-bold outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 uppercase text-[10px] font-bold mb-1">Hero Suffix</label>
                    <input
                      type="text"
                      value={homepageForm.heroHeadlineSuffix || ''}
                      onChange={(e) => setHomepageForm({ ...homepageForm, heroHeadlineSuffix: e.target.value })}
                      className="w-full bg-[#080b14] border border-[#273153] rounded p-2 text-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 uppercase text-[10px] font-bold mb-1">About Section Headline</label>
                    <input
                      type="text"
                      value={homepageForm.aboutHeadline || ''}
                      onChange={(e) => setHomepageForm({ ...homepageForm, aboutHeadline: e.target.value })}
                      className="w-full bg-[#080b14] border border-[#273153] rounded p-2 text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 uppercase text-[10px] font-bold mb-1">CTA Assistance Headline</label>
                    <input
                      type="text"
                      value={homepageForm.ctaHeadline || ''}
                      onChange={(e) => setHomepageForm({ ...homepageForm, ctaHeadline: e.target.value })}
                      className="w-full bg-[#080b14] border border-[#273153] rounded p-2 text-white outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isSavingToFirestore}
                    className="px-6 py-2.5 bg-[#d4ff32] hover:bg-[#c1ec25] text-[#080b14] font-extrabold uppercase rounded-lg transition-colors cursor-pointer"
                  >
                    {isSavingToFirestore ? 'Saving to Firestore...' : 'Save Headlines to Firestore'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 7: VIDEO PLACEMENTS & PLAYBACK CONTROLS */}
          {/* ==================================================== */}
          {activeTab === 'placements' && (
            <div className="space-y-6 font-mono text-xs">
              <div className="p-5 bg-[#13192f] rounded-2xl border border-[#273153] space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                    <Video className="w-4 h-4 text-[#d4ff32]" />
                    <span>Website Video Placements &amp; Playback Controls</span>
                  </h3>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Assign videos to specific website sections with granular autoplay, mute, loop, and control settings.
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  {(homepageForm.videoPlacements || []).map((plc) => (
                    <div key={plc.id} className="p-4 bg-[#080b14] rounded-xl border border-[#273153] space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#273153] pb-2">
                        <div>
                          <span className="font-bold text-white text-sm block">{plc.name}</span>
                          <span className="text-[#d4ff32] text-[10px]">{plc.location}</span>
                        </div>
                        <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 font-bold">
                          <input
                            type="checkbox"
                            checked={plc.enabled}
                            onChange={(e) => handleSavePlacement({ ...plc, enabled: e.target.checked })}
                            className="rounded border-[#273153] bg-[#13192f] text-[#d4ff32] focus:ring-0"
                          />
                          <span>Enable Video in this Section</span>
                        </label>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                        <div className="md:col-span-8">
                          <label className="block text-slate-400 text-[10px] uppercase font-bold mb-1">Cloudinary Video URL:</label>
                          <input
                            type="text"
                            value={plc.videoUrl}
                            onChange={(e) => handleSavePlacement({ ...plc, videoUrl: e.target.value })}
                            placeholder="https://res.cloudinary.com/zpzdjznd/video/upload/..."
                            className="w-full bg-[#13192f] border border-[#273153] focus:border-[#d4ff32] rounded p-2 text-white outline-none"
                          />
                        </div>
                        <div className="md:col-span-4 flex flex-wrap gap-4 pt-4 md:pt-0">
                          <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={plc.autoplay}
                              onChange={(e) => handleSavePlacement({ ...plc, autoplay: e.target.checked })}
                              className="rounded border-[#273153] bg-[#13192f] text-[#d4ff32]"
                            />
                            <span>Autoplay</span>
                          </label>
                          <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={plc.muted}
                              onChange={(e) => handleSavePlacement({ ...plc, muted: e.target.checked })}
                              className="rounded border-[#273153] bg-[#13192f] text-[#d4ff32]"
                            />
                            <span>Muted</span>
                          </label>
                          <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={plc.loop}
                              onChange={(e) => handleSavePlacement({ ...plc, loop: e.target.checked })}
                              className="rounded border-[#273153] bg-[#13192f] text-[#d4ff32]"
                            />
                            <span>Loop</span>
                          </label>
                          <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={plc.controls}
                              onChange={(e) => handleSavePlacement({ ...plc, controls: e.target.checked })}
                              className="rounded border-[#273153] bg-[#13192f] text-[#d4ff32]"
                            />
                            <span>Controls</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 8: MEDIA LIBRARY (IMAGES + VIDEOS TO CLOUDINARY) */}
          {/* ==================================================== */}
          {activeTab === 'media' && (
            <div className="space-y-6 font-mono text-xs">
              <input type="file" ref={mediaFileInputRef} onChange={handleUploadMediaFile} accept="image/*,video/*" multiple className="hidden" />

              <div className="p-5 bg-[#13192f] rounded-2xl border border-[#273153] space-y-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-[#d4ff32]" />
                      <span>Cloudinary Media Library (Images + Videos)</span>
                    </h3>
                    <p className="text-slate-400 text-[11px]">
                      Upload images and up to 50-second videos directly from your local computer.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => mediaFileInputRef.current?.click()}
                      disabled={isUploadingMedia}
                      className="px-4 py-2 bg-[#d4ff32] hover:bg-[#c1ec25] text-[#080b14] font-bold uppercase rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Media from Local PC</span>
                    </button>
                  </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setMediaTypeFilter('all')}
                      className={`px-3 py-1.5 rounded-lg border text-xs cursor-pointer ${
                        mediaTypeFilter === 'all' ? 'bg-[#d4ff32] text-[#080b14] border-[#d4ff32] font-bold' : 'bg-[#080b14] text-slate-400 border-[#273153]'
                      }`}
                    >
                      All ({mediaItems.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setMediaTypeFilter('image')}
                      className={`px-3 py-1.5 rounded-lg border text-xs cursor-pointer ${
                        mediaTypeFilter === 'image' ? 'bg-[#d4ff32] text-[#080b14] border-[#d4ff32] font-bold' : 'bg-[#080b14] text-slate-400 border-[#273153]'
                      }`}
                    >
                      Images ({mediaItems.filter(m => m.mediaType !== 'video').length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setMediaTypeFilter('video')}
                      className={`px-3 py-1.5 rounded-lg border text-xs cursor-pointer ${
                        mediaTypeFilter === 'video' ? 'bg-[#d4ff32] text-[#080b14] border-[#d4ff32] font-bold' : 'bg-[#080b14] text-slate-400 border-[#273153]'
                      }`}
                    >
                      Videos ({mediaItems.filter(m => m.mediaType === 'video').length})
                    </button>
                  </div>

                  <div className="relative w-64">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={mediaSearch}
                      onChange={(e) => setMediaSearch(e.target.value)}
                      placeholder="Filter files..."
                      className="w-full bg-[#080b14] border border-[#273153] rounded-lg pl-8 pr-3 py-1.5 text-white outline-none"
                    />
                  </div>
                </div>

                {/* Media Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 pt-2">
                  {filteredMedia.map((m) => {
                    const isVid = m.mediaType === 'video';
                    return (
                      <div key={m.id} className="p-2.5 bg-[#080b14] rounded-xl border border-[#273153] space-y-2 group">
                        <div className="aspect-square rounded-lg overflow-hidden bg-black relative flex items-center justify-center">
                          {isVid ? (
                            <video src={m.url} className="w-full h-full object-cover" />
                          ) : (
                            <img src={m.url} alt={m.originalFilename} className="w-full h-full object-cover" />
                          )}
                          {isVid && (
                            <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-[#080b14]/90 text-[#d4ff32] text-[9px] font-bold flex items-center gap-0.5">
                              <Play className="w-2 h-2 fill-current" /> {m.duration ? `${Math.round(m.duration)}s` : 'VID'}
                            </span>
                          )}
                        </div>

                        <div>
                          <span className="font-bold text-white text-[11px] block truncate" title={m.originalFilename}>
                            {m.originalFilename}
                          </span>
                          <span className="text-slate-500 text-[9px] block truncate">{m.locationUsed || 'Media Library'}</span>
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-[#273153]">
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(m.url);
                              showFeedback('Copied Cloudinary URL to clipboard!');
                            }}
                            className="p-1 text-slate-400 hover:text-white"
                            title="Copy Cloudinary URL"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <a
                            href={m.url}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1 text-slate-400 hover:text-[#d4ff32]"
                            title="Open direct file"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                          <button
                            type="button"
                            onClick={async () => {
                              if (window.confirm(`Delete "${m.originalFilename}" from Firestore media registry?`)) {
                                await dataService.deleteMediaItem(m.id);
                                showFeedback('Media item deleted from registry.');
                              }
                            }}
                            className="p-1 text-slate-400 hover:text-red-400"
                            title="Delete Media Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 9: BUSINESS INFORMATION */}
          {/* ==================================================== */}
          {activeTab === 'business' && (
            <div className="space-y-6 font-mono text-xs max-w-2xl">
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setIsSavingToFirestore(true);
                  try {
                    await dataService.saveBusinessInfo(businessForm);
                    showFeedback('Business information saved to Cloud Firestore!');
                  } catch (err: any) {
                    showFeedback(err.message || 'Failed to save business info', true);
                  } finally {
                    setIsSavingToFirestore(false);
                  }
                }}
                className="p-5 bg-[#13192f] rounded-2xl border border-[#273153] space-y-4"
              >
                <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                  <Building className="w-4 h-4 text-[#d4ff32]" />
                  <span>Business Contact &amp; Credentials</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 text-[10px] uppercase font-bold mb-1">Company Name</label>
                    <input
                      type="text"
                      value={businessForm.name}
                      onChange={(e) => setBusinessForm({ ...businessForm, name: e.target.value })}
                      className="w-full bg-[#080b14] border border-[#273153] rounded p-2 text-white font-bold outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[10px] uppercase font-bold mb-1">Proprietor / Lead</label>
                    <input
                      type="text"
                      value={businessForm.owner}
                      onChange={(e) => setBusinessForm({ ...businessForm, owner: e.target.value })}
                      className="w-full bg-[#080b14] border border-[#273153] rounded p-2 text-[#d4ff32] font-bold outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 text-[10px] uppercase font-bold mb-1">Business Description</label>
                  <input
                    type="text"
                    value={businessForm.description}
                    onChange={(e) => setBusinessForm({ ...businessForm, description: e.target.value })}
                    className="w-full bg-[#080b14] border border-[#273153] rounded p-2 text-white outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 text-[10px] uppercase font-bold mb-1">Physical Location</label>
                    <input
                      type="text"
                      value={businessForm.location}
                      onChange={(e) => setBusinessForm({ ...businessForm, location: e.target.value })}
                      className="w-full bg-[#080b14] border border-[#273153] rounded p-2 text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[10px] uppercase font-bold mb-1">Shop Door Code</label>
                    <input
                      type="text"
                      value={businessForm.shopDoor}
                      onChange={(e) => setBusinessForm({ ...businessForm, shopDoor: e.target.value })}
                      className="w-full bg-[#080b14] border border-[#273153] rounded p-2 text-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 text-[10px] uppercase font-bold mb-1">Primary Hotline</label>
                    <input
                      type="text"
                      value={businessForm.phones[0] || ''}
                      onChange={(e) => {
                        const newPhones = [...businessForm.phones];
                        newPhones[0] = e.target.value;
                        setBusinessForm({ ...businessForm, phones: newPhones });
                      }}
                      className="w-full bg-[#080b14] border border-[#273153] rounded p-2 text-white font-bold outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[10px] uppercase font-bold mb-1">Secondary Hotline</label>
                    <input
                      type="text"
                      value={businessForm.phones[1] || ''}
                      onChange={(e) => {
                        const newPhones = [...businessForm.phones];
                        newPhones[1] = e.target.value;
                        setBusinessForm({ ...businessForm, phones: newPhones });
                      }}
                      className="w-full bg-[#080b14] border border-[#273153] rounded p-2 text-white font-bold outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isSavingToFirestore}
                    className="px-6 py-2.5 bg-[#d4ff32] hover:bg-[#c1ec25] text-[#080b14] font-extrabold uppercase rounded-lg transition-colors cursor-pointer"
                  >
                    {isSavingToFirestore ? 'Saving to Firestore...' : 'Save Business Info to Firestore'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 10: WHATSAPP ORDERING CONFIGURATION */}
          {/* ==================================================== */}
          {activeTab === 'whatsapp' && (
            <div className="space-y-6 font-mono text-xs max-w-2xl">
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setIsSavingToFirestore(true);
                  try {
                    await dataService.saveWhatsAppSettings(whatsappForm);
                    showFeedback('WhatsApp settings saved to Cloud Firestore!');
                  } catch (err: any) {
                    showFeedback(err.message || 'Failed to save WhatsApp settings', true);
                  } finally {
                    setIsSavingToFirestore(false);
                  }
                }}
                className="p-5 bg-[#13192f] rounded-2xl border border-[#273153] space-y-4"
              >
                <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#d4ff32]" />
                  <span>WhatsApp Direct Ordering Engine</span>
                </h3>

                <p className="text-slate-400 text-xs">
                  All "Place Order" buttons immediately launch WhatsApp with a pre-filled message. No customer forms or private customer databases are stored on the site.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 text-[10px] uppercase font-bold mb-1">Local Hotline Number</label>
                    <input
                      type="text"
                      value={whatsappForm.phoneNumber}
                      onChange={(e) => setWhatsappForm({ ...whatsappForm, phoneNumber: e.target.value })}
                      className="w-full bg-[#080b14] border border-[#273153] rounded p-2 text-white font-bold outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[10px] uppercase font-bold mb-1">International Format</label>
                    <input
                      type="text"
                      value={whatsappForm.internationalNumber}
                      onChange={(e) => setWhatsappForm({ ...whatsappForm, internationalNumber: e.target.value })}
                      className="w-full bg-[#080b14] border border-[#273153] rounded p-2 text-[#d4ff32] font-bold outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 text-[10px] uppercase font-bold mb-1">Product Order Template</label>
                  <input
                    type="text"
                    value={whatsappForm.messageTemplate}
                    onChange={(e) => setWhatsappForm({ ...whatsappForm, messageTemplate: e.target.value })}
                    className="w-full bg-[#080b14] border border-[#273153] rounded p-2 text-white outline-none"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Use <code className="text-[#d4ff32]">{"{productName}"}</code> for dynamic insertion.
                  </span>
                </div>

                <div>
                  <label className="block text-slate-400 text-[10px] uppercase font-bold mb-1">General Enquiry Message</label>
                  <input
                    type="text"
                    value={whatsappForm.defaultMessage}
                    onChange={(e) => setWhatsappForm({ ...whatsappForm, defaultMessage: e.target.value })}
                    className="w-full bg-[#080b14] border border-[#273153] rounded p-2 text-white outline-none"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isSavingToFirestore}
                    className="px-6 py-2.5 bg-[#d4ff32] hover:bg-[#c1ec25] text-[#080b14] font-extrabold uppercase rounded-lg transition-colors cursor-pointer"
                  >
                    {isSavingToFirestore ? 'Saving to Firestore...' : 'Save WhatsApp Engine to Firestore'}
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
