import React, { useState, useRef } from 'react';
import { 
  X, Plus, Edit2, Trash2, Check, Star, 
  Layers, Image as ImageIcon, Building, RefreshCw, Download, 
  Upload, Shield, Lock, Eye, EyeOff, LogOut, CheckCircle, 
  AlertCircle, FileUp, MessageSquare, LayoutDashboard, 
  Sliders, ArrowUp, ArrowDown, Copy, ExternalLink, Sparkles,
  Phone, Smartphone, Search, Film, Play, Video, Volume2, 
  VolumeX, RotateCcw, MonitorPlay, SlidersHorizontal, CheckSquare
} from 'lucide-react';
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
import { dataService, cleanProductNameFromFileName, STOREFRONT_IMAGE, STOREFRONT_IMAGE_INTERIOR } from '../services/dataService';
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
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => dataService.isAdminAuthenticated());
  const [passcodeInput, setPasscodeInput] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [authError, setAuthError] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

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
  const showFeedback = (msg: string, isError = false) => {
    if (isError) {
      setActionError(msg);
      setTimeout(() => setActionError(''), 5000);
    } else {
      setActionSuccess(msg);
      setTimeout(() => setActionSuccess(''), 3500);
    }
  };

  // ----------------------------------------------------
  // SECTION 2: PRODUCTS STATE
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
  // SECTION 3: CATEGORIES STATE
  // ----------------------------------------------------
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');

  // ----------------------------------------------------
  // SECTION 5: HERO SLIDESHOW STATE
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
  // SECTION 6: HOMEPAGE CONTENT & BACKGROUND STATE
  // ----------------------------------------------------
  const [homepageForm, setHomepageForm] = useState<HomepageContent>({ ...homepageContent });
  const bgImageInputRef = useRef<HTMLInputElement>(null);
  const bgVideoInputRef = useRef<HTMLInputElement>(null);

  // ----------------------------------------------------
  // SECTION 7: MEDIA LIBRARY (IMAGES & VIDEOS) STATE
  // ----------------------------------------------------
  const [mediaSearch, setMediaSearch] = useState('');
  const [mediaTypeFilter, setMediaTypeFilter] = useState<'all' | 'image' | 'video'>('all');
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [previewMediaModal, setPreviewMediaModal] = useState<MediaItem | null>(null);
  const mediaFileInputRef = useRef<HTMLInputElement>(null);

  // ----------------------------------------------------
  // SECTION 8: BUSINESS INFORMATION STATE
  // ----------------------------------------------------
  const [businessForm, setBusinessForm] = useState<BusinessInfo>({ ...businessInfo });

  // ----------------------------------------------------
  // SECTION 9: WHATSAPP SETTINGS STATE
  // ----------------------------------------------------
  const [whatsappForm, setWhatsappForm] = useState<WhatsAppSettings>({ ...whatsappSettings });

  // ----------------------------------------------------
  // AUTHENTICATION SUBMISSION (Passcode = yaw)
  // ----------------------------------------------------
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (dataService.verifyAdminPasscode(passcodeInput)) {
      dataService.setAdminAuthenticated(true, rememberMe);
      setIsAuthenticated(true);
      setAuthError('');
      showFeedback('Authenticated as Ankobeng Motors Administrator.');
    } else {
      setAuthError('Invalid passcode. Please enter the correct admin passcode.');
    }
  };

  const handleLogout = () => {
    dataService.logoutAdmin();
    setIsAuthenticated(false);
    setPasscodeInput('');
  };

  // ----------------------------------------------------
  // GENERIC MEDIA UPLOAD (Local Computer -> Cloudinary)
  // ----------------------------------------------------
  const handleUploadMediaFile = async (e: React.ChangeEvent<HTMLInputElement>, targetLocation?: string) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingMedia(true);
    setUploadProgressText('Uploading media to Cloudinary...');

    try {
      let count = 0;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const isVid = isVideoFile(file);

        if (isVid) {
          setUploadProgressText(`Validating video ${file.name} (Max 1m 30s)...`);
          const duration = await getVideoDuration(file);
          if (duration > MAX_VIDEO_DURATION_SECONDS) {
            throw new Error(`Video "${file.name}" is ${Math.round(duration)} seconds long, which exceeds the 1 min 30 secs (90-second) maximum limit.`);
          }
          setUploadProgressText(`Uploading video "${file.name}" to Cloudinary...`);
        } else {
          setUploadProgressText(`Uploading image "${file.name}" to Cloudinary...`);
        }

        const res = await uploadToCloudinary(file, file.name);

        dataService.addMediaItem({
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

      onDataChanged();
      showFeedback(`Successfully uploaded ${count} media asset(s) to Cloudinary!`);
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
          throw new Error(`Background video duration is ${Math.round(duration)}s (Maximum allowed is 1 min 30 secs / 90 seconds).`);
        }
      }

      const res = await uploadToCloudinary(file, file.name);

      // Add to media library
      const media = dataService.addMediaItem({
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
        const updated = {
          ...homepageForm,
          homepageBackgroundType: 'video' as const,
          homepageBackgroundVideo: res.secureUrl,
          homepageBackgroundVideoDuration: res.duration
        };
        setHomepageForm(updated);
        dataService.saveHomepageContent(updated);
        showFeedback('Uploaded and applied Homepage Background Video!');
      } else {
        const updated = {
          ...homepageForm,
          homepageBackgroundType: 'image' as const,
          homepageBackgroundImage: res.secureUrl,
          homepageBackgroundPublicId: res.publicId
        };
        setHomepageForm(updated);
        dataService.saveHomepageContent(updated);
        showFeedback('Uploaded and applied Homepage Background Image!');
      }

      onDataChanged();
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

        // Add to global media library
        dataService.addMediaItem({
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

      onDataChanged();
      showFeedback('Product images uploaded to Cloudinary successfully!');
    } catch (err: any) {
      showFeedback(err.message || 'Image upload failed.', true);
    } finally {
      setIsUploadingToCloudinary(false);
      setUploadProgressText('');
      if (e.target) e.target.value = '';
    }
  };

  // Product Video Upload (e.g. running engine or inspection clip)
  const handleProductVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingToCloudinary(true);
    setUploadProgressText('Uploading product demonstration video to Cloudinary...');

    try {
      const duration = await getVideoDuration(file);
      if (duration > MAX_VIDEO_DURATION_SECONDS) {
        throw new Error(`Video is ${Math.round(duration)}s long. Maximum allowed is 1 min 30 secs (90 seconds).`);
      }

      const res = await uploadToCloudinary(file, file.name);

      dataService.addMediaItem({
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

      onDataChanged();
      showFeedback('Product video clip uploaded and attached!');
    } catch (err: any) {
      showFeedback(err.message || 'Video upload failed.', true);
    } finally {
      setIsUploadingToCloudinary(false);
      setUploadProgressText('');
      if (e.target) e.target.value = '';
    }
  };

  // Save / Update Product
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name.trim()) {
      showFeedback('Please provide a product name.', true);
      return;
    }
    if (productForm.images.length === 0) {
      showFeedback('Please upload or select at least one product image.', true);
      return;
    }

    if (productForm.id) {
      const existing = dataService.getProductById(productForm.id);
      if (existing) {
        dataService.updateProduct({
          ...existing,
          name: productForm.name.trim(),
          category: productForm.category,
          images: productForm.images,
          imageDetails: productForm.imageDetails,
          videoUrl: productForm.videoUrl || undefined,
          videoPublicId: productForm.videoPublicId || undefined,
          videoDuration: productForm.videoDuration || undefined,
          fitment: productForm.fitment.trim(),
          condition: productForm.condition,
          availability: productForm.availability,
          description: productForm.description.trim(),
          application: productForm.application.trim(),
          featured: productForm.featured
        });
        showFeedback(`Product "${productForm.name}" updated successfully!`);
      }
    } else {
      dataService.addProduct({
        name: productForm.name.trim(),
        category: productForm.category,
        images: productForm.images,
        imageDetails: productForm.imageDetails,
        videoUrl: productForm.videoUrl || undefined,
        videoPublicId: productForm.videoPublicId || undefined,
        videoDuration: productForm.videoDuration || undefined,
        fitment: productForm.fitment.trim(),
        condition: productForm.condition,
        availability: productForm.availability,
        description: productForm.description.trim(),
        application: productForm.application.trim(),
        featured: productForm.featured
      });
      showFeedback(`Product "${productForm.name}" created and published!`);
    }

    setIsEditingProduct(false);
    onDataChanged();
  };

  // ----------------------------------------------------
  // HERO SLIDE UPLOAD & SAVE
  // ----------------------------------------------------
  const handleHeroFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingToCloudinary(true);
    setUploadProgressText('Uploading hero media to Cloudinary...');

    try {
      const isVid = isVideoFile(file);
      if (isVid) {
        const duration = await getVideoDuration(file);
        if (duration > MAX_VIDEO_DURATION_SECONDS) {
          throw new Error(`Video is ${Math.round(duration)}s long (Max limit is 1 min 30 secs / 90 seconds).`);
        }
      }

      const res = await uploadToCloudinary(file, file.name);

      dataService.addMediaItem({
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

      onDataChanged();
      showFeedback('Hero media uploaded to Cloudinary successfully!');
    } catch (err: any) {
      showFeedback(err.message || 'Media upload failed.', true);
    } finally {
      setIsUploadingToCloudinary(false);
      setUploadProgressText('');
      if (e.target) e.target.value = '';
    }
  };

  const handleSaveHeroSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slideForm.title.trim()) {
      showFeedback('Please provide a slide title.', true);
      return;
    }
    if (!slideForm.image) {
      showFeedback('Please select or upload a slide image or video.', true);
      return;
    }

    if (slideForm.id) {
      dataService.updateHeroSlide({
        id: slideForm.id,
        title: slideForm.title.trim(),
        subtitle: slideForm.subtitle.trim(),
        badge: slideForm.badge.trim() || 'SHOP DOOR E-3',
        image: slideForm.image,
        publicId: slideForm.publicId,
        mediaType: slideForm.mediaType || 'image',
        videoUrl: slideForm.videoUrl,
        videoDuration: slideForm.videoDuration,
        description: slideForm.description.trim(),
        active: slideForm.active
      });
      showFeedback('Hero slide updated successfully!');
    } else {
      dataService.addHeroSlide({
        title: slideForm.title.trim(),
        subtitle: slideForm.subtitle.trim(),
        badge: slideForm.badge.trim() || 'SHOP DOOR E-3',
        image: slideForm.image,
        publicId: slideForm.publicId,
        mediaType: slideForm.mediaType || 'image',
        videoUrl: slideForm.videoUrl,
        videoDuration: slideForm.videoDuration,
        description: slideForm.description.trim(),
        active: slideForm.active
      });
      showFeedback('New hero slide created!');
    }

    setIsEditingSlide(false);
    onDataChanged();
  };

  // ----------------------------------------------------
  // VIDEO PLACEMENTS SAVE & TOGGLE
  // ----------------------------------------------------
  const handleSavePlacement = (placement: VideoPlacementConfig) => {
    const placements = homepageForm.videoPlacements || [];
    const idx = placements.findIndex(p => p.id === placement.id);
    let updated: VideoPlacementConfig[];
    if (idx !== -1) {
      updated = [...placements];
      updated[idx] = placement;
    } else {
      updated = [...placements, placement];
    }

    const newHomepage = { ...homepageForm, videoPlacements: updated };
    
    // Also sync specific section properties for convenience
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
    dataService.saveHomepageContent(newHomepage);
    onDataChanged();
    showFeedback(`Saved configuration for "${placement.name}"!`);
  };

  // ----------------------------------------------------
  // 1. RENDER LOGIN SCREEN IF UNAUTHENTICATED
  // ----------------------------------------------------
  if (!isAuthenticated) {
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
              {businessInfo.name} • {businessInfo.location}
            </p>
          </div>

          {authError && (
            <div className="p-3 bg-red-950/60 border border-red-500/50 rounded-xl text-red-200 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 font-mono text-xs">
            <div>
              <label className="block text-slate-300 font-bold uppercase mb-1.5">
                Admin Passcode:
              </label>
              <div className="relative">
                <input
                  type={showPasscode ? 'text' : 'password'}
                  value={passcodeInput}
                  onChange={(e) => setPasscodeInput(e.target.value)}
                  placeholder="Enter passcode (yaw)"
                  className="w-full bg-[#13192f] border border-[#273153] focus:border-[#d4ff32] rounded-lg px-3.5 py-2.5 text-white font-mono text-sm tracking-wider outline-none transition-colors"
                  autoFocus
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                  tabIndex={-1}
                >
                  {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#273153] bg-[#13192f] text-[#d4ff32] focus:ring-0"
                />
                <span>Remember session</span>
              </label>
              <span className="text-slate-500">Shop Door E-3</span>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/2 py-2.5 bg-[#13192f] hover:bg-[#18203d] text-slate-300 rounded-lg font-bold transition-colors cursor-pointer"
                >
                  Return to Store
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-[#d4ff32] hover:bg-[#c1ec25] text-[#080b14] font-extrabold uppercase rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Unlock Portal</span>
                </button>
              </div>

              {/* Quick Unlock */}
              <button
                type="button"
                onClick={() => {
                  dataService.setAdminAuthenticated(true, true);
                  setIsAuthenticated(true);
                  showFeedback('Unlocked Admin Dashboard as Store Manager.');
                }}
                className="w-full py-2 bg-[#080b14] hover:bg-[#13192f] text-slate-400 hover:text-[#d4ff32] border border-[#273153] hover:border-[#d4ff32]/50 rounded-lg text-[11px] font-mono transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Shield className="w-3 h-3 text-[#d4ff32]" />
                <span>Instant Unlock (Manager / Development Access)</span>
              </button>
            </div>
          </form>

          <div className="pt-4 border-t border-[#273153] text-center text-[10px] text-slate-500 font-mono">
            Admin Passcode: <span className="text-[#d4ff32] font-bold">yaw</span>
          </div>
        </div>
      </div>
    );
  }

  // ====================================================
  // 2. RENDER AUTHENTICATED CMS DASHBOARD (IMAGES + VIDEOS)
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
              <span className="text-[10px] font-mono text-[#d4ff32] uppercase font-bold tracking-widest">
                ADMIN CONTROL CENTER • CLOUDINARY CONNECTED (zpzdjznd)
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black uppercase text-white font-heading">
              {businessInfo.name} — MEDIA &amp; CONTENT CMS
            </h2>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="hidden md:inline-block px-2.5 py-1 bg-[#080b14] border border-[#273153] rounded text-slate-300 text-[11px]">
              Door: <strong className="text-white">{businessInfo.shopDoor}</strong>
            </span>

            <button
              onClick={onClose}
              className="px-3 py-2 bg-[#0d1222] hover:bg-[#18203d] text-[#d4ff32] border border-[#273153] hover:border-[#d4ff32]/50 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Return to Public Storefront"
            >
              <span>&larr; View Storefront</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm('Reset all catalog, media, and CMS content to factory defaults?')) {
                  dataService.resetAll();
                  onDataChanged();
                  showFeedback('All content restored to initial factory defaults.');
                }
              }}
              className="p-2 text-slate-400 hover:text-amber-300 bg-[#0d1222] rounded-lg border border-[#273153] transition-colors cursor-pointer"
              title="Reset to Factory Defaults"
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
          {/* TAB 1: DASHBOARD METRICS & OVERVIEW */}
          {/* ==================================================== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 font-mono text-xs">
              {/* Metrics Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-[#13192f] rounded-xl border border-[#273153]">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Total Products</span>
                  <div className="text-2xl font-black text-white">{products.length}</div>
                  <span className="text-[#d4ff32] text-[10px] mt-1 block">In Store Catalogue</span>
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
                  <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Cloudinary CDN</span>
                  <div className="text-emerald-400 font-black text-sm flex items-center gap-1.5 mt-1">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>CONNECTED</span>
                  </div>
                  <span className="text-slate-400 text-[10px] mt-1 block font-mono">zpzdjznd</span>
                </div>
              </div>

              {/* Cloudinary Integration Status Card */}
              <div className="p-5 bg-[#13192f] rounded-2xl border border-[#273153] space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#d4ff32]" />
                    <h3 className="text-sm font-bold text-white uppercase">Cloudinary Unsigned Upload Configuration</h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded bg-[#d4ff32]/20 text-[#d4ff32] font-mono text-[10px] font-bold">
                    PRESET ACTIVE
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-[#080b14] rounded-xl border border-[#273153] text-[11px]">
                  <div>
                    <span className="text-slate-500 block uppercase text-[10px]">Cloud Name:</span>
                    <span className="text-white font-bold">{CLOUDINARY_CONFIG.cloudName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block uppercase text-[10px]">Upload Preset:</span>
                    <span className="text-[#d4ff32] font-bold">{CLOUDINARY_CONFIG.uploadPreset}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block uppercase text-[10px]">Max Video Length:</span>
                    <span className="text-white font-bold">1 min 30 secs (90s limit)</span>
                  </div>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Direct unsigned client-side uploads are enabled for both high-resolution product photographs and up to 1 min 30 secs demonstration videos. All uploaded files go directly to your Cloudinary media library.
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
                  <span className="text-slate-400 text-[11px]">Upload engine or spare part with images/video</span>
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
                  <span className="block text-white font-bold text-sm">Upload Video (Max 1m 30s)</span>
                  <span className="text-slate-400 text-[11px]">Upload shop tour or engine test clips to Cloudinary</span>
                </button>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 2: PRODUCTS MANAGEMENT (IMAGES + VIDEOS) */}
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
                                    onClick={() => {
                                      dataService.updateProduct({ ...prod, featured: !prod.featured });
                                      onDataChanged();
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
                                        images: prod.images,
                                        imageDetails: prod.imageDetails || prod.images.map(url => ({ url })),
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
                                    className="p-1.5 text-slate-300 hover:text-white bg-[#080b14] hover:bg-[#273153] rounded border border-[#273153] transition-colors cursor-pointer"
                                    title="Edit Product"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (window.confirm(`Delete product "${prod.name}" from inventory?`)) {
                                        dataService.deleteProduct(prod.id);
                                        onDataChanged();
                                        showFeedback(`Deleted product ${prod.name}`);
                                      }
                                    }}
                                    className="p-1.5 text-slate-400 hover:text-red-400 bg-[#080b14] hover:bg-red-950/40 rounded border border-[#273153] transition-colors cursor-pointer"
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
                /* EDIT PRODUCT FORM */
                <form onSubmit={handleSaveProduct} className="p-5 sm:p-6 bg-[#13192f] rounded-2xl border border-[#273153] space-y-6 font-mono text-xs">
                  <div className="flex items-center justify-between border-b border-[#273153] pb-4">
                    <h3 className="text-base font-bold text-white uppercase flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#d4ff32]" />
                      <span>{productForm.id ? `Edit Product: ${productForm.name}` : 'Create New Product'}</span>
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsEditingProduct(false)}
                      className="text-slate-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 font-bold uppercase mb-1">
                        Product Name: (Exact Rule: e.g. OPEL 1.6, ASTRA G, OPEL HEAD 2.0)
                      </label>
                      <input
                        type="text"
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        placeholder="e.g. OPEL 1.6"
                        className="w-full bg-[#080b14] border border-[#273153] focus:border-[#d4ff32] rounded-lg px-3.5 py-2.5 text-white font-bold outline-none"
                        required
                      />
                      <p className="text-[10px] text-slate-400 mt-1">
                        Uploading an image will automatically adopt the exact filename (excluding extension).
                      </p>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold uppercase mb-1">
                        Category:
                      </label>
                      <select
                        value={productForm.category}
                        onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                        className="w-full bg-[#080b14] border border-[#273153] focus:border-[#d4ff32] rounded-lg px-3.5 py-2.5 text-white outline-none"
                      >
                        {categories.map(c => (
                          <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Media Uploads: Images & Demonstration Video */}
                  <div className="space-y-4 p-4 bg-[#080b14] rounded-xl border border-[#273153]">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <span className="text-white font-bold text-sm block">Product Images &amp; Video</span>
                        <span className="text-slate-400 text-[11px]">Upload images &amp; optional demo video (Max 50s) to Cloudinary</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          ref={productFileInputRef}
                          onChange={handleProductFileUpload}
                          multiple
                          accept="image/*"
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => productFileInputRef.current?.click()}
                          disabled={isUploadingToCloudinary}
                          className="px-3 py-2 bg-[#13192f] hover:bg-[#18203d] text-[#d4ff32] border border-[#273153] hover:border-[#d4ff32]/50 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Images</span>
                        </button>

                        <input
                          type="file"
                          ref={productVideoInputRef}
                          onChange={handleProductVideoUpload}
                          accept="video/*"
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => productVideoInputRef.current?.click()}
                          disabled={isUploadingToCloudinary}
                          className="px-3 py-2 bg-[#13192f] hover:bg-[#18203d] text-emerald-300 border border-[#273153] hover:border-emerald-400/50 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Film className="w-3.5 h-3.5" />
                          <span>Attach Video (Max 50s)</span>
                        </button>
                      </div>
                    </div>

                    {/* Image Thumbnails List */}
                    <div className="space-y-2">
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Uploaded Images ({productForm.images.length}):</span>
                      {productForm.images.length === 0 ? (
                        <div className="p-4 border border-dashed border-[#273153] rounded-lg text-center text-slate-500 text-xs">
                          No images uploaded yet. Upload from your computer or pick from the Media Library.
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-3">
                          {productForm.images.map((imgUrl, idx) => (
                            <div key={idx} className="relative group w-24 h-20 rounded-lg overflow-hidden bg-black border border-[#273153]">
                              <img src={imgUrl} alt={`Uploaded ${idx}`} className="w-full h-full object-cover" />
                              {idx === 0 && (
                                <span className="absolute top-1 left-1 bg-[#d4ff32] text-[#080b14] text-[9px] font-bold px-1 rounded uppercase">
                                  Primary
                                </span>
                              )}
                              <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                                {idx !== 0 && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const reordered = [...productForm.images];
                                      const [moved] = reordered.splice(idx, 1);
                                      reordered.unshift(moved);
                                      setProductForm({ ...productForm, images: reordered });
                                    }}
                                    className="p-1 bg-[#d4ff32] text-[#080b14] rounded"
                                    title="Make Primary Image"
                                  >
                                    <Star className="w-3 h-3 fill-current" />
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const filtered = productForm.images.filter((_, i) => i !== idx);
                                    setProductForm({ ...productForm, images: filtered });
                                  }}
                                  className="p-1 bg-red-600 text-white rounded"
                                  title="Remove Image"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Attached Video Clip Display */}
                    {productForm.videoUrl && (
                      <div className="p-3 bg-[#13192f] rounded-lg border border-[#273153] flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <Play className="w-4 h-4 text-[#d4ff32] fill-current" />
                          <div>
                            <span className="text-white font-bold block text-xs">Attached Video Demonstration</span>
                            <span className="text-slate-400 text-[10px]">
                              {productForm.videoDuration ? `Duration: ${Math.round(productForm.videoDuration)}s • ` : ''}Cloudinary Hosted
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setProductForm({ ...productForm, videoUrl: '', videoPublicId: undefined, videoDuration: undefined })}
                          className="px-2.5 py-1 text-red-400 hover:text-red-300 bg-[#080b14] border border-red-900/50 rounded text-[11px]"
                        >
                          Remove Video
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Specifications & Compatibility */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 font-bold uppercase mb-1">
                        Fitment / Compatibility:
                      </label>
                      <input
                        type="text"
                        value={productForm.fitment}
                        onChange={(e) => setProductForm({ ...productForm, fitment: e.target.value })}
                        placeholder="e.g. Opel Astra, Vectra A, Zafira"
                        className="w-full bg-[#080b14] border border-[#273153] focus:border-[#d4ff32] rounded-lg px-3.5 py-2 text-white outline-none"
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
                        placeholder="In Stock (Shop Door E-3)"
                        className="w-full bg-[#080b14] border border-[#273153] focus:border-[#d4ff32] rounded-lg px-3.5 py-2 text-white outline-none"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-slate-300 font-bold uppercase mb-1">
                        Technical Overview / Description:
                      </label>
                      <textarea
                        value={productForm.description}
                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                        rows={3}
                        placeholder="Complete assembly with mounting points, intake components, and engine wiring."
                        className="w-full bg-[#080b14] border border-[#273153] focus:border-[#d4ff32] rounded-lg p-3 text-white outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={productForm.featured}
                        onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                        className="rounded border-[#273153] bg-[#080b14] text-[#d4ff32] focus:ring-0"
                      />
                      <span className="text-white font-bold">Feature this engine in Homepage Spotlight</span>
                    </label>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#273153]">
                    <button
                      type="button"
                      onClick={() => setIsEditingProduct(false)}
                      className="px-4 py-2.5 bg-[#080b14] hover:bg-[#18203d] text-slate-300 rounded-lg transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isUploadingToCloudinary}
                      className="px-6 py-2.5 bg-[#d4ff32] hover:bg-[#c1ec25] text-[#080b14] font-extrabold uppercase rounded-lg transition-colors cursor-pointer flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>{productForm.id ? 'Save Changes' : 'Publish Product'}</span>
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
            <div className="space-y-6 max-w-4xl font-mono text-xs">
              <div className="p-4 sm:p-5 bg-[#13192f] rounded-2xl border border-[#273153] space-y-4">
                <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#d4ff32]" />
                  <span>Inventory Categories</span>
                </h3>

                {/* Add Category Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newCategoryName.trim()) return;
                    dataService.addCategory(newCategoryName.trim());
                    setNewCategoryName('');
                    onDataChanged();
                    showFeedback(`Category "${newCategoryName}" added!`);
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="e.g. Gearboxes, Cylinder Heads..."
                    className="flex-1 bg-[#080b14] border border-[#273153] focus:border-[#d4ff32] rounded-lg px-3.5 py-2 text-white outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#d4ff32] hover:bg-[#c1ec25] text-[#080b14] font-bold uppercase rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add</span>
                  </button>
                </form>

                {/* Category List */}
                <div className="divide-y divide-[#273153] bg-[#080b14] rounded-xl border border-[#273153] overflow-hidden">
                  {categories.map((cat, idx) => (
                    <div key={cat.id} className="p-3.5 flex items-center justify-between gap-3">
                      {editingCategoryId === cat.id ? (
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            type="text"
                            value={editingCategoryName}
                            onChange={(e) => setEditingCategoryName(e.target.value)}
                            className="flex-1 bg-[#13192f] border border-[#d4ff32] rounded px-3 py-1 text-white outline-none"
                            autoFocus
                          />
                          <button
                            onClick={() => {
                              if (editingCategoryName.trim()) {
                                dataService.updateCategory({ ...cat, name: editingCategoryName.trim() });
                                setEditingCategoryId(null);
                                onDataChanged();
                                showFeedback('Category updated!');
                              }
                            }}
                            className="p-1.5 bg-[#d4ff32] text-[#080b14] rounded"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingCategoryId(null)}
                            className="p-1.5 bg-slate-700 text-white rounded"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div>
                            <span className="text-white font-bold text-sm block">{cat.name}</span>
                            <span className="text-slate-500 text-[10px]">
                              Slug: {cat.slug} • {products.filter(p => p.category === cat.name).length} products assigned
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setEditingCategoryId(cat.id);
                                setEditingCategoryName(cat.name);
                              }}
                              className="p-1.5 text-slate-300 hover:text-white bg-[#13192f] rounded border border-[#273153]"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete category "${cat.name}"?`)) {
                                  dataService.deleteCategory(cat.id);
                                  onDataChanged();
                                  showFeedback('Category removed.');
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
          {/* TAB 4: FEATURED PRODUCTS MANAGEMENT */}
          {/* ==================================================== */}
          {activeTab === 'featured' && (
            <div className="space-y-6 max-w-4xl font-mono text-xs">
              <div className="p-4 sm:p-5 bg-[#13192f] rounded-2xl border border-[#273153] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                      <Star className="w-4 h-4 text-[#d4ff32]" />
                      <span>Featured Powertrains Showcase</span>
                    </h3>
                    <p className="text-slate-400 text-[11px]">
                      Select which engines appear on the primary homepage showcase carousel.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {products.map((prod) => (
                    <div
                      key={prod.id}
                      className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
                        prod.featured 
                          ? 'bg-[#080b14] border-[#d4ff32]/60' 
                          : 'bg-[#080b14]/50 border-[#273153] opacity-75'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-10 rounded bg-black overflow-hidden border border-[#273153] shrink-0">
                          {prod.images[0] && <img src={prod.images[0]} alt={prod.name} className="w-full h-full object-cover" />}
                        </div>
                        <div>
                          <span className="text-white font-bold block">{prod.name}</span>
                          <span className="text-[#d4ff32] text-[10px]">{prod.category}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          dataService.updateProduct({ ...prod, featured: !prod.featured });
                          onDataChanged();
                          showFeedback(`Updated featured status for ${prod.name}`);
                        }}
                        className={`px-3 py-1.5 rounded text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                          prod.featured 
                            ? 'bg-[#d4ff32] text-[#080b14]' 
                            : 'bg-[#13192f] text-slate-300 hover:text-white border border-[#273153]'
                        }`}
                      >
                        <Star className={`w-3 h-3 ${prod.featured ? 'fill-current' : ''}`} />
                        <span>{prod.featured ? 'Featured' : 'Include'}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 5: HERO SLIDESHOW (IMAGES & VIDEOS) */}
          {/* ==================================================== */}
          {activeTab === 'hero' && (
            <div className="space-y-6">
              {!isEditingSlide ? (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white uppercase font-mono">Hero Slideshow Carousel</h3>
                      <p className="text-slate-400 text-xs font-mono">Manage showcase slides with photos or videos.</p>
                    </div>
                    <button
                      onClick={() => {
                        setIsEditingSlide(true);
                        setSlideForm({
                          title: '',
                          subtitle: '',
                          badge: 'SHOP DOOR E-3',
                          image: '',
                          mediaType: 'image',
                          description: '',
                          active: true
                        });
                      }}
                      className="px-4 py-2 bg-[#d4ff32] hover:bg-[#c1ec25] text-[#080b14] font-bold font-mono text-xs uppercase rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Slide</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
                    {heroSlides.map((slide) => (
                      <div key={slide.id} className="bg-[#13192f] rounded-2xl border border-[#273153] overflow-hidden flex flex-col">
                        <div className="relative aspect-[16/10] bg-black">
                          {slide.mediaType === 'video' || slide.videoUrl ? (
                            <video src={slide.videoUrl || slide.image} className="w-full h-full object-cover" />
                          ) : (
                            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                          )}
                          <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#080b14]/90 text-[#d4ff32] text-[10px] font-bold border border-[#273153]">
                            {slide.badge || 'SHOP DOOR E-3'}
                          </span>
                          {(slide.mediaType === 'video' || slide.videoUrl) && (
                            <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-[#d4ff32] text-[#080b14] text-[10px] font-bold flex items-center gap-1">
                              <Play className="w-2.5 h-2.5 fill-current" /> Video
                            </span>
                          )}
                        </div>
                        <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                          <div>
                            <span className="text-[#d4ff32] text-[10px] uppercase font-bold block">{slide.subtitle}</span>
                            <h4 className="text-white font-bold text-sm uppercase">{slide.title}</h4>
                            {slide.description && <p className="text-slate-400 text-[11px] mt-1">{slide.description}</p>}
                          </div>
                          <div className="pt-3 border-t border-[#273153] flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={slide.active}
                                onChange={(e) => {
                                  dataService.updateHeroSlide({ ...slide, active: e.target.checked });
                                  onDataChanged();
                                  showFeedback('Slide status toggled.');
                                }}
                                className="rounded border-[#273153] bg-[#080b14] text-[#d4ff32]"
                              />
                              <span className="text-slate-300 text-[11px]">Active</span>
                            </label>
                            <div className="space-x-1.5">
                              <button
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
                                className="p-1.5 bg-[#080b14] text-slate-300 hover:text-white rounded border border-[#273153]"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm('Delete hero slide?')) {
                                    dataService.deleteHeroSlide(slide.id);
                                    onDataChanged();
                                    showFeedback('Hero slide deleted.');
                                  }
                                }}
                                className="p-1.5 bg-[#080b14] text-slate-400 hover:text-red-400 rounded border border-[#273153]"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                /* EDIT SLIDE FORM */
                <form onSubmit={handleSaveHeroSlide} className="p-5 sm:p-6 bg-[#13192f] rounded-2xl border border-[#273153] space-y-4 font-mono text-xs max-w-2xl">
                  <div className="flex items-center justify-between border-b border-[#273153] pb-3">
                    <h3 className="text-sm font-bold text-white uppercase">
                      {slideForm.id ? 'Edit Hero Slide' : 'Create New Hero Slide'}
                    </h3>
                    <button type="button" onClick={() => setIsEditingSlide(false)} className="text-slate-400 hover:text-white">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold uppercase mb-1">Slide Title:</label>
                    <input
                      type="text"
                      value={slideForm.title}
                      onChange={(e) => setSlideForm({ ...slideForm, title: e.target.value })}
                      placeholder="OPEL POWERTRAIN SPECIALISTS"
                      className="w-full bg-[#080b14] border border-[#273153] rounded-lg px-3.5 py-2 text-white"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-bold uppercase mb-1">Subtitle:</label>
                      <input
                        type="text"
                        value={slideForm.subtitle}
                        onChange={(e) => setSlideForm({ ...slideForm, subtitle: e.target.value })}
                        placeholder="ABOSSEY OKAI STOCK"
                        className="w-full bg-[#080b14] border border-[#273153] rounded-lg px-3.5 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-bold uppercase mb-1">Badge:</label>
                      <input
                        type="text"
                        value={slideForm.badge}
                        onChange={(e) => setSlideForm({ ...slideForm, badge: e.target.value })}
                        placeholder="SHOP DOOR E-3"
                        className="w-full bg-[#080b14] border border-[#273153] rounded-lg px-3.5 py-2 text-white"
                      />
                    </div>
                  </div>

                  {/* Media Upload for Slide */}
                  <div className="space-y-2 p-3.5 bg-[#080b14] rounded-xl border border-[#273153]">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-bold">Slide Media (Image or Video &le;50s)</span>
                      <input
                        type="file"
                        ref={heroFileInputRef}
                        onChange={handleHeroFileUpload}
                        accept="image/*,video/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => heroFileInputRef.current?.click()}
                        className="px-3 py-1.5 bg-[#13192f] hover:bg-[#18203d] text-[#d4ff32] border border-[#273153] rounded flex items-center gap-1"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload from PC</span>
                      </button>
                    </div>

                    {slideForm.image && (
                      <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-black border border-[#273153]">
                        {slideForm.mediaType === 'video' || slideForm.videoUrl ? (
                          <video src={slideForm.videoUrl || slideForm.image} controls className="w-full h-full object-cover" />
                        ) : (
                          <img src={slideForm.image} alt="Slide preview" className="w-full h-full object-cover" />
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold uppercase mb-1">Description:</label>
                    <textarea
                      value={slideForm.description}
                      onChange={(e) => setSlideForm({ ...slideForm, description: e.target.value })}
                      rows={2}
                      placeholder="Direct stockists of Opel engines..."
                      className="w-full bg-[#080b14] border border-[#273153] rounded-lg p-3 text-white"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#273153]">
                    <button
                      type="button"
                      onClick={() => setIsEditingSlide(false)}
                      className="px-4 py-2 bg-[#080b14] text-slate-300 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#d4ff32] text-[#080b14] font-extrabold uppercase rounded flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>Save Slide</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 6: HOMEPAGE CONTENT & DEDICATED HOMEPAGE BACKGROUND */}
          {/* ==================================================== */}
          {activeTab === 'homepage' && (
            <div className="space-y-6 max-w-4xl font-mono text-xs">
              {/* Dedicated Homepage Background Image / Video Setting */}
              <div className="p-5 sm:p-6 bg-[#13192f] rounded-2xl border border-[#273153] space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <MonitorPlay className="w-4 h-4 text-[#d4ff32]" />
                      <h3 className="text-sm font-bold text-white uppercase">Homepage Background Media Setting</h3>
                    </div>
                    <p className="text-slate-400 text-[11px]">
                      Upload a new background image or loop video from your computer. Automatically applied to the live storefront.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={bgImageInputRef}
                      onChange={(e) => handleUploadHomepageBg(e, false)}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      onClick={() => bgImageInputRef.current?.click()}
                      disabled={isUploadingToCloudinary}
                      className="px-3 py-2 bg-[#080b14] hover:bg-[#18203d] text-[#d4ff32] border border-[#273153] hover:border-[#d4ff32]/50 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Background Image</span>
                    </button>

                    <input
                      type="file"
                      ref={bgVideoInputRef}
                      onChange={(e) => handleUploadHomepageBg(e, true)}
                      accept="video/*"
                      className="hidden"
                    />
                    <button
                      onClick={() => bgVideoInputRef.current?.click()}
                      disabled={isUploadingToCloudinary}
                      className="px-3 py-2 bg-[#080b14] hover:bg-[#18203d] text-emerald-300 border border-[#273153] hover:border-emerald-400/50 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Film className="w-3.5 h-3.5" />
                      <span>Upload Background Video (Max 1m 30s)</span>
                    </button>
                  </div>
                </div>

                {/* Active Background Preview */}
                <div className="p-4 bg-[#080b14] rounded-xl border border-[#273153] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">
                      Current Background Mode: <strong className="text-white uppercase">{homepageForm.homepageBackgroundType || 'image'}</strong>
                    </span>
                    <button
                      onClick={() => {
                        const resetBg = {
                          ...homepageForm,
                          homepageBackgroundType: 'image' as const,
                          homepageBackgroundImage: STOREFRONT_IMAGE,
                          homepageBackgroundVideo: ''
                        };
                        setHomepageForm(resetBg);
                        dataService.saveHomepageContent(resetBg);
                        onDataChanged();
                        showFeedback('Restored original Abossey Okai storefront backdrop.');
                      }}
                      className="text-[#d4ff32] hover:underline text-[11px]"
                    >
                      Reset to Abossey Okai Storefront Photo
                    </button>
                  </div>

                  <div className="relative aspect-[21/9] sm:aspect-[16/7] rounded-xl overflow-hidden bg-black border border-[#273153]">
                    {homepageForm.homepageBackgroundType === 'video' && homepageForm.homepageBackgroundVideo ? (
                      <video
                        src={homepageForm.homepageBackgroundVideo}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={homepageForm.homepageBackgroundImage || STOREFRONT_IMAGE}
                        alt="Storefront Background"
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent flex items-center p-6">
                      <div className="text-white space-y-1">
                        <span className="text-[#d4ff32] text-[10px] font-bold uppercase">{businessInfo.name}</span>
                        <h4 className="text-lg font-black uppercase font-heading">{homepageForm.heroHeadlineHighlight || 'OPEL ENGINES'}</h4>
                        <p className="text-xs text-slate-300 font-mono">{businessInfo.location}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Homepage Text Headlines & Section Copy */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  dataService.saveHomepageContent(homepageForm);
                  onDataChanged();
                  showFeedback('Homepage content and headlines saved!');
                }}
                className="p-5 sm:p-6 bg-[#13192f] rounded-2xl border border-[#273153] space-y-5"
              >
                <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                  <Edit2 className="w-4 h-4 text-[#d4ff32]" />
                  <span>Homepage Headlines &amp; Section Descriptions</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-400 uppercase text-[10px] font-bold mb-1">Prefix:</label>
                    <input
                      type="text"
                      value={homepageForm.heroHeadlinePrefix}
                      onChange={(e) => setHomepageForm({ ...homepageForm, heroHeadlinePrefix: e.target.value })}
                      className="w-full bg-[#080b14] border border-[#273153] rounded px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 uppercase text-[10px] font-bold mb-1">Highlight:</label>
                    <input
                      type="text"
                      value={homepageForm.heroHeadlineHighlight}
                      onChange={(e) => setHomepageForm({ ...homepageForm, heroHeadlineHighlight: e.target.value })}
                      className="w-full bg-[#080b14] border border-[#273153] rounded px-3 py-2 text-white font-bold text-[#d4ff32]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 uppercase text-[10px] font-bold mb-1">Suffix:</label>
                    <input
                      type="text"
                      value={homepageForm.heroHeadlineSuffix}
                      onChange={(e) => setHomepageForm({ ...homepageForm, heroHeadlineSuffix: e.target.value })}
                      className="w-full bg-[#080b14] border border-[#273153] rounded px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 uppercase text-[10px] font-bold mb-1">Location Subtitle:</label>
                  <input
                    type="text"
                    value={homepageForm.heroLocationSubtitle}
                    onChange={(e) => setHomepageForm({ ...homepageForm, heroLocationSubtitle: e.target.value })}
                    className="w-full bg-[#080b14] border border-[#273153] rounded px-3 py-2 text-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-3 p-3.5 bg-[#080b14] rounded-xl border border-[#273153]">
                    <span className="text-white font-bold block">Featured Section Copy</span>
                    <input
                      type="text"
                      value={homepageForm.featuredTitle}
                      onChange={(e) => setHomepageForm({ ...homepageForm, featuredTitle: e.target.value })}
                      placeholder="Featured Section Title"
                      className="w-full bg-[#13192f] border border-[#273153] rounded px-3 py-2 text-white"
                    />
                    <textarea
                      value={homepageForm.featuredSubtitle}
                      onChange={(e) => setHomepageForm({ ...homepageForm, featuredSubtitle: e.target.value })}
                      rows={2}
                      className="w-full bg-[#13192f] border border-[#273153] rounded p-2 text-white"
                    />
                  </div>

                  <div className="space-y-3 p-3.5 bg-[#080b14] rounded-xl border border-[#273153]">
                    <span className="text-white font-bold block">About Shop Verification Copy</span>
                    <input
                      type="text"
                      value={homepageForm.aboutHeadline}
                      onChange={(e) => setHomepageForm({ ...homepageForm, aboutHeadline: e.target.value })}
                      placeholder="About Headline"
                      className="w-full bg-[#13192f] border border-[#273153] rounded px-3 py-2 text-white"
                    />
                    <textarea
                      value={homepageForm.aboutDescription}
                      onChange={(e) => setHomepageForm({ ...homepageForm, aboutDescription: e.target.value })}
                      rows={2}
                      className="w-full bg-[#13192f] border border-[#273153] rounded p-2 text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-3">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#d4ff32] hover:bg-[#c1ec25] text-[#080b14] font-extrabold uppercase rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save Homepage Copy</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 7: VIDEO PLACEMENTS & CONTROLS MANAGER */}
          {/* ==================================================== */}
          {activeTab === 'placements' && (
            <div className="space-y-6 max-w-4xl font-mono text-xs">
              <div className="p-5 sm:p-6 bg-[#13192f] rounded-2xl border border-[#273153] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4 text-[#d4ff32]" />
                      <h3 className="text-sm font-bold text-white uppercase">Website Video Placements &amp; Controls</h3>
                    </div>
                    <p className="text-slate-400 text-[11px]">
                      Place an uploaded video anywhere on the website. Configure autoplay, audio muting, loop, controls, and active state per section.
                    </p>
                  </div>
                </div>

                {/* Video Placements Cards */}
                <div className="space-y-4">
                  {(homepageForm.videoPlacements || []).map((placement) => (
                    <div
                      key={placement.id}
                      className="p-4 bg-[#080b14] rounded-xl border border-[#273153] space-y-3"
                    >
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <Film className="w-4 h-4 text-[#d4ff32]" />
                          <div>
                            <span className="text-white font-bold text-sm block">{placement.name}</span>
                            <span className="text-slate-400 text-[10px]">Location: {placement.location}</span>
                          </div>
                        </div>

                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={placement.enabled}
                            onChange={(e) => {
                              handleSavePlacement({ ...placement, enabled: e.target.checked });
                            }}
                            className="rounded border-[#273153] bg-[#13192f] text-[#d4ff32]"
                          />
                          <span className={`font-bold text-[11px] ${placement.enabled ? 'text-[#d4ff32]' : 'text-slate-500'}`}>
                            {placement.enabled ? 'ENABLED' : 'DISABLED'}
                          </span>
                        </label>
                      </div>

                      {/* Video URL & Selector */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                        <div className="sm:col-span-2">
                          <label className="block text-slate-400 uppercase text-[10px] font-bold mb-1">
                            Video Cloudinary URL:
                          </label>
                          <input
                            type="text"
                            value={placement.videoUrl}
                            onChange={(e) => {
                              handleSavePlacement({ ...placement, videoUrl: e.target.value });
                            }}
                            placeholder="https://res.cloudinary.com/zpzdjznd/video/upload/..."
                            className="w-full bg-[#13192f] border border-[#273153] rounded px-3 py-2 text-white font-mono text-[11px]"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-400 uppercase text-[10px] font-bold mb-1">
                            Assign From Library:
                          </label>
                          <select
                            value={placement.videoUrl}
                            onChange={(e) => {
                              const chosen = mediaItems.find(m => m.url === e.target.value);
                              handleSavePlacement({
                                ...placement,
                                videoUrl: e.target.value,
                                publicId: chosen?.publicId,
                                duration: chosen?.duration,
                                enabled: !!e.target.value
                              });
                            }}
                            className="w-full bg-[#13192f] border border-[#273153] rounded px-3 py-2 text-white text-[11px]"
                          >
                            <option value="">-- Select from Media Library --</option>
                            {mediaItems
                              .filter(m => m.mediaType === 'video' || isVideoFile(new File([], m.originalFilename)))
                              .map(m => (
                                <option key={m.id} value={m.url}>
                                  {m.originalFilename} {m.duration ? `(${Math.round(m.duration)}s)` : ''}
                                </option>
                              ))}
                          </select>
                        </div>
                      </div>

                      {/* Video Player Configuration Toggles */}
                      <div className="p-3 bg-[#13192f] rounded-lg border border-[#273153] grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={placement.autoplay}
                            onChange={(e) => handleSavePlacement({ ...placement, autoplay: e.target.checked })}
                            className="rounded border-[#273153] bg-[#080b14] text-[#d4ff32]"
                          />
                          <span className="text-slate-300 text-[11px]">Autoplay</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={placement.muted}
                            onChange={(e) => handleSavePlacement({ ...placement, muted: e.target.checked })}
                            className="rounded border-[#273153] bg-[#080b14] text-[#d4ff32]"
                          />
                          <span className="text-slate-300 text-[11px]">Muted</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={placement.loop}
                            onChange={(e) => handleSavePlacement({ ...placement, loop: e.target.checked })}
                            className="rounded border-[#273153] bg-[#080b14] text-[#d4ff32]"
                          />
                          <span className="text-slate-300 text-[11px]">Loop</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={placement.controls}
                            onChange={(e) => handleSavePlacement({ ...placement, controls: e.target.checked })}
                            className="rounded border-[#273153] bg-[#080b14] text-[#d4ff32]"
                          />
                          <span className="text-slate-300 text-[11px]">Show Controls</span>
                        </label>
                      </div>

                      {/* Interactive Preview if URL is set */}
                      {placement.videoUrl && (
                        <div className="relative aspect-[16/8] max-w-md rounded-lg overflow-hidden bg-black border border-[#273153]">
                          <video
                            src={placement.videoUrl}
                            autoPlay={placement.autoplay}
                            muted={placement.muted}
                            loop={placement.loop}
                            controls={placement.controls}
                            playsInline
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 8: MEDIA LIBRARY (BOTH IMAGES AND VIDEOS) */}
          {/* ==================================================== */}
          {activeTab === 'media' && (
            <div className="space-y-6">
              {/* Media Library Toolbar */}
              <div className="p-4 sm:p-5 bg-[#13192f] rounded-2xl border border-[#273153] space-y-4 font-mono text-xs">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-[#d4ff32]" />
                      <span>Cloudinary Media Library (Images + Videos)</span>
                    </h3>
                    <p className="text-slate-400 text-[11px]">
                      Upload images and up to 1 min 30 secs (90-second) videos directly from your local computer.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={mediaFileInputRef}
                      onChange={(e) => handleUploadMediaFile(e)}
                      multiple
                      accept="image/*,video/*"
                      className="hidden"
                    />
                    <button
                      onClick={() => mediaFileInputRef.current?.click()}
                      disabled={isUploadingMedia}
                      className="px-4 py-2 bg-[#d4ff32] hover:bg-[#c1ec25] text-[#080b14] font-extrabold uppercase rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Upload Files from PC</span>
                    </button>
                  </div>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#273153]">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setMediaTypeFilter('all')}
                      className={`px-3 py-1.5 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                        mediaTypeFilter === 'all' ? 'bg-[#d4ff32] text-[#080b14]' : 'bg-[#080b14] text-slate-300'
                      }`}
                    >
                      All Assets ({mediaItems.length})
                    </button>
                    <button
                      onClick={() => setMediaTypeFilter('image')}
                      className={`px-3 py-1.5 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                        mediaTypeFilter === 'image' ? 'bg-[#d4ff32] text-[#080b14]' : 'bg-[#080b14] text-slate-300'
                      }`}
                    >
                      Images Only ({mediaItems.filter(m => m.mediaType !== 'video').length})
                    </button>
                    <button
                      onClick={() => setMediaTypeFilter('video')}
                      className={`px-3 py-1.5 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                        mediaTypeFilter === 'video' ? 'bg-[#d4ff32] text-[#080b14]' : 'bg-[#080b14] text-slate-300'
                      }`}
                    >
                      Videos Only ({mediaItems.filter(m => m.mediaType === 'video').length})
                    </button>
                  </div>

                  <div className="relative flex-1 max-w-xs">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={mediaSearch}
                      onChange={(e) => setMediaSearch(e.target.value)}
                      placeholder="Search filenames..."
                      className="w-full pl-8 pr-3 py-1.5 bg-[#080b14] border border-[#273153] rounded text-white text-[11px] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Media Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 font-mono text-xs">
                {filteredMedia.map((item) => {
                  const isVideo = item.mediaType === 'video';
                  return (
                    <div
                      key={item.id}
                      className="bg-[#13192f] rounded-xl border border-[#273153] overflow-hidden flex flex-col group hover:border-[#d4ff32]/50 transition-colors"
                    >
                      {/* Media Thumbnail Box */}
                      <div className="relative aspect-[4/3] bg-black overflow-hidden flex items-center justify-center">
                        {isVideo ? (
                          <div className="relative w-full h-full">
                            <video
                              src={item.url}
                              className="w-full h-full object-cover"
                              preload="metadata"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <span className="p-2 rounded-full bg-[#d4ff32] text-[#080b14] shadow-lg">
                                <Play className="w-4 h-4 fill-current" />
                              </span>
                            </div>
                            {item.duration && (
                              <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/90 text-[#d4ff32] text-[9px] font-bold">
                                {Math.round(item.duration)}s
                              </span>
                            )}
                          </div>
                        ) : (
                          <img src={item.url} alt={item.originalFilename} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        )}

                        <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/80 text-white text-[9px] uppercase font-bold border border-[#273153]">
                          {item.format || (isVideo ? 'mp4' : 'jpg')}
                        </span>
                      </div>

                      {/* Details & Actions */}
                      <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-white font-bold text-[11px] block truncate" title={item.originalFilename}>
                            {item.originalFilename}
                          </span>
                          {item.locationUsed && (
                            <span className="text-slate-400 text-[10px] block truncate">
                              Used: {item.locationUsed}
                            </span>
                          )}
                        </div>

                        <div className="pt-2 border-t border-[#273153] flex items-center justify-between gap-1">
                          <button
                            onClick={() => setPreviewMediaModal(item)}
                            className="p-1.5 bg-[#080b14] hover:bg-[#18203d] text-[#d4ff32] rounded border border-[#273153]"
                            title="Preview Media"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(item.url);
                              showFeedback('Copied Cloudinary URL to clipboard!');
                            }}
                            className="p-1.5 bg-[#080b14] hover:bg-[#18203d] text-slate-300 rounded border border-[#273153]"
                            title="Copy Cloudinary URL"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              if (window.confirm(`Delete media asset "${item.originalFilename}"?`)) {
                                dataService.deleteMediaItem(item.id);
                                onDataChanged();
                                showFeedback('Media asset removed.');
                              }
                            }}
                            className="p-1.5 bg-[#080b14] hover:bg-red-950 text-slate-400 hover:text-red-400 rounded border border-[#273153]"
                            title="Delete Media Asset"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 9: BUSINESS INFORMATION */}
          {/* ==================================================== */}
          {activeTab === 'business' && (
            <div className="space-y-6 max-w-3xl font-mono text-xs">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  dataService.saveBusinessInfo(businessForm);
                  onDataChanged();
                  showFeedback('Business information saved successfully!');
                }}
                className="p-5 sm:p-6 bg-[#13192f] rounded-2xl border border-[#273153] space-y-4"
              >
                <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                  <Building className="w-4 h-4 text-[#d4ff32]" />
                  <span>Physical Store Verification &amp; Credentials</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 uppercase text-[10px] font-bold mb-1">Trading Name:</label>
                    <input
                      type="text"
                      value={businessForm.name}
                      onChange={(e) => setBusinessForm({ ...businessForm, name: e.target.value })}
                      className="w-full bg-[#080b14] border border-[#273153] rounded px-3 py-2 text-white font-bold"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 uppercase text-[10px] font-bold mb-1">Proprietor / Owner:</label>
                    <input
                      type="text"
                      value={businessForm.owner}
                      onChange={(e) => setBusinessForm({ ...businessForm, owner: e.target.value })}
                      className="w-full bg-[#080b14] border border-[#273153] rounded px-3 py-2 text-white font-bold text-[#d4ff32]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 uppercase text-[10px] font-bold mb-1">Location Details:</label>
                    <input
                      type="text"
                      value={businessForm.location}
                      onChange={(e) => setBusinessForm({ ...businessForm, location: e.target.value })}
                      className="w-full bg-[#080b14] border border-[#273153] rounded px-3 py-2 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 uppercase text-[10px] font-bold mb-1">Shop Door Code:</label>
                    <input
                      type="text"
                      value={businessForm.shopDoor}
                      onChange={(e) => setBusinessForm({ ...businessForm, shopDoor: e.target.value })}
                      className="w-full bg-[#080b14] border border-[#273153] rounded px-3 py-2 text-white font-bold"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 uppercase text-[10px] font-bold mb-1">Primary Hotline:</label>
                    <input
                      type="text"
                      value={businessForm.phones[0]}
                      onChange={(e) => {
                        const newPhones = [...businessForm.phones];
                        newPhones[0] = e.target.value;
                        setBusinessForm({ ...businessForm, phones: newPhones });
                      }}
                      className="w-full bg-[#080b14] border border-[#273153] rounded px-3 py-2 text-white font-bold"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 uppercase text-[10px] font-bold mb-1">Secondary Hotline:</label>
                    <input
                      type="text"
                      value={businessForm.phones[1] || ''}
                      onChange={(e) => {
                        const newPhones = [...businessForm.phones];
                        newPhones[1] = e.target.value;
                        setBusinessForm({ ...businessForm, phones: newPhones });
                      }}
                      className="w-full bg-[#080b14] border border-[#273153] rounded px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-3">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#d4ff32] hover:bg-[#c1ec25] text-[#080b14] font-extrabold uppercase rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save Business Info</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 10: WHATSAPP SETTINGS */}
          {/* ==================================================== */}
          {activeTab === 'whatsapp' && (
            <div className="space-y-6 max-w-3xl font-mono text-xs">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  dataService.saveWhatsAppSettings(whatsappForm);
                  onDataChanged();
                  showFeedback('WhatsApp ordering settings updated!');
                }}
                className="p-5 sm:p-6 bg-[#13192f] rounded-2xl border border-[#273153] space-y-4"
              >
                <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#d4ff32]" />
                  <span>Direct WhatsApp Ordering Channel</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 uppercase text-[10px] font-bold mb-1">Store Phone:</label>
                    <input
                      type="text"
                      value={whatsappForm.phoneNumber}
                      onChange={(e) => setWhatsappForm({ ...whatsappForm, phoneNumber: e.target.value })}
                      className="w-full bg-[#080b14] border border-[#273153] rounded px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 uppercase text-[10px] font-bold mb-1">International Format:</label>
                    <input
                      type="text"
                      value={whatsappForm.internationalNumber}
                      onChange={(e) => setWhatsappForm({ ...whatsappForm, internationalNumber: e.target.value })}
                      className="w-full bg-[#080b14] border border-[#273153] rounded px-3 py-2 text-white font-bold text-[#d4ff32]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 uppercase text-[10px] font-bold mb-1">
                    Product Order Message Template (Use {'{productName}'}):
                  </label>
                  <input
                    type="text"
                    value={whatsappForm.messageTemplate}
                    onChange={(e) => setWhatsappForm({ ...whatsappForm, messageTemplate: e.target.value })}
                    className="w-full bg-[#080b14] border border-[#273153] rounded px-3 py-2 text-white"
                  />
                </div>

                <div className="flex justify-end pt-3">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#d4ff32] hover:bg-[#c1ec25] text-[#080b14] font-extrabold uppercase rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save WhatsApp Config</span>
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>

      {/* Global Media Preview Modal (for high-res photos or video playback) */}
      {previewMediaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative w-full max-w-3xl bg-[#0d1222] border border-[#273153] rounded-2xl overflow-hidden p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-[#273153] pb-3">
              <div>
                <span className="text-[#d4ff32] text-[10px] font-mono font-bold uppercase">
                  {previewMediaModal.mediaType === 'video' ? `Video Clip (${Math.round(previewMediaModal.duration || 0)}s)` : 'High-Res Photo'}
                </span>
                <h4 className="text-white font-bold font-mono text-sm">{previewMediaModal.originalFilename}</h4>
              </div>
              <button
                onClick={() => setPreviewMediaModal(null)}
                className="p-1.5 text-slate-400 hover:text-white bg-[#13192f] rounded border border-[#273153]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-[16/9] bg-black rounded-xl overflow-hidden flex items-center justify-center">
              {previewMediaModal.mediaType === 'video' ? (
                <video
                  src={previewMediaModal.url}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                />
              ) : (
                <img
                  src={previewMediaModal.url}
                  alt={previewMediaModal.originalFilename}
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="truncate max-w-md">{previewMediaModal.url}</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(previewMediaModal.url);
                  showFeedback('Cloudinary URL copied!');
                }}
                className="px-3 py-1.5 bg-[#d4ff32] text-[#080b14] font-bold rounded flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy URL</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
