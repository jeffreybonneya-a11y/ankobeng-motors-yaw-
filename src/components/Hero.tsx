import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Phone, ChevronLeft, ChevronRight, ShoppingBag, ArrowRight, Play } from 'lucide-react';
import { HeroSlide, BusinessInfo, HomepageContent } from '../types';
import { OptimizedImage } from './OptimizedImage';

interface HeroProps {
  slides: HeroSlide[];
  businessInfo: BusinessInfo;
  homepageContent?: HomepageContent;
  onExploreEngines: () => void;
  onPlaceOrder: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  slides,
  businessInfo,
  homepageContent,
  onExploreEngines,
  onPlaceOrder
}) => {
  const activeSlides = slides.filter(s => s.active);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (activeSlides.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % activeSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [activeSlides.length, isPaused]);

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % activeSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 40) {
      nextSlide();
    } else if (diff < -40) {
      prevSlide();
    }
    touchStartX.current = null;
  };

  // Preload next slide image so transitions are instant without flashing
  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const nextIdx = (currentSlideIndex + 1) % activeSlides.length;
    const nextSlideItem = activeSlides[nextIdx];
    if (nextSlideItem && nextSlideItem.image && !nextSlideItem.videoUrl && nextSlideItem.mediaType !== 'video') {
      const img = new Image();
      img.src = nextSlideItem.image;
    }
  }, [currentSlideIndex, activeSlides]);

  const currentSlide = activeSlides[currentSlideIndex] || activeSlides[0];

  // Background Media Configuration (Image or Video)
  const isBackgroundVideo = homepageContent?.homepageBackgroundType === 'video' && !!homepageContent?.homepageBackgroundVideo;
  const bgVideoUrl = homepageContent?.homepageBackgroundVideo;
  const bgImageUrl = homepageContent?.homepageBackgroundImage;
  const bgVideoSettings = homepageContent?.homepageBackgroundVideoSettings || {
    autoplay: true,
    muted: true,
    loop: true,
    controls: false
  };

  return (
    <section className="relative border-b border-[#273153] py-12 lg:py-20 overflow-hidden" data-purpose="hero-section">
      {/* Dynamic Background Media (Cloudinary Uploaded Image or Video) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {isBackgroundVideo && bgVideoUrl ? (
          <video
            src={bgVideoUrl}
            autoPlay={bgVideoSettings.autoplay}
            muted={bgVideoSettings.muted}
            loop={bgVideoSettings.loop}
            controls={bgVideoSettings.controls}
            playsInline
            preload="metadata"
            className="w-full h-full object-cover object-center"
          />
        ) : bgImageUrl ? (
          <OptimizedImage
            src={bgImageUrl}
            alt="Ankobeng Motors Storefront - Near the Post Office, Abossey Okai, Accra"
            className="w-full h-full object-cover object-center"
            priority={true}
          />
        ) : (
          <div className="w-full h-full bg-[#080b14]" />
        )}
        {/* Subtle neutral overlay to guarantee crisp text readability while keeping the storefront or media clearly visible */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#080b14]/85 via-[#080b14]/65 to-[#080b14]/45"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Hero Narrative */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              <p className="tech-mono text-xs sm:text-sm text-[#d4ff32] uppercase tracking-widest font-bold">
                {businessInfo.name} — {businessInfo.owner}
              </p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-tight font-heading">
                {homepageContent?.heroHeadlinePrefix || 'DEALERS IN'}{' '}
                <span className="text-[#d4ff32]">
                  {homepageContent?.heroHeadlineHighlight || 'OPEL ENGINES'}
                </span>{' '}
                {homepageContent?.heroHeadlineSuffix || '& ALL KINDS OF ENGINE PARTS'}
              </h1>
              <p className="text-sm sm:text-base text-slate-300 font-mono">
                {homepageContent?.heroLocationSubtitle || businessInfo.location}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onExploreEngines}
                className="bg-[#d4ff32] hover:bg-[#c1ec25] text-[#080b14] px-6 sm:px-7 py-3 sm:py-3.5 rounded font-mono text-xs tracking-wider uppercase font-extrabold transition-all hover:scale-[1.02] flex items-center gap-2 cursor-pointer"
              >
                <span>EXPLORE ENGINES</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onPlaceOrder}
                className="bg-[#13192f] hover:bg-[#18203d] text-white border border-[#273153] hover:border-[#d4ff32]/60 px-6 sm:px-7 py-3 sm:py-3.5 rounded font-mono text-xs tracking-wider uppercase font-bold transition-all flex items-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-[#d4ff32]" />
                <span>PLACE ORDER</span>
              </button>
            </div>

            {/* Location & Hotlines info bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-[#273153] tech-mono text-xs text-slate-400">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded bg-[#13192f] border border-[#273153] flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-[#d4ff32]" />
                </div>
                <div>
                  <span className="block text-white font-bold">LOCATION</span>
                  <span className="text-slate-300">{businessInfo.location}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded bg-[#13192f] border border-[#273153] flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-[#d4ff32]" />
                </div>
                <div>
                  <span className="block text-white font-bold">DIRECT HOTLINES</span>
                  <div className="flex gap-2 text-slate-300 font-mono font-bold">
                    <a href={`tel:${businessInfo.phones[0]}`} className="hover:text-[#d4ff32] transition-colors">{businessInfo.phones[0]}</a>
                    <span>/</span>
                    <a href={`tel:${businessInfo.phones[1]}`} className="hover:text-[#d4ff32] transition-colors">{businessInfo.phones[1]}</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Specimen Display / Interactive Hero Slideshow */}
          <div 
            className="lg:col-span-6" 
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="relative bg-[#13192f] p-3 sm:p-4 rounded-2xl border border-[#273153] shadow-lg">
              {/* Main Media Frame */}
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-black">
                {currentSlide && (
                  currentSlide.mediaType === 'video' || currentSlide.videoUrl ? (
                    <video
                      src={currentSlide.videoUrl || currentSlide.image}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      controls
                      className="object-cover w-full h-full rounded-xl"
                    />
                  ) : (
                    <OptimizedImage
                      src={currentSlide.image}
                      alt={currentSlide.title}
                      priority={true}
                      className="w-full h-full rounded-xl transition-all duration-700 ease-out"
                    />
                  )
                )}

                {/* Slideshow Nav Controls */}
                {activeSlides.length > 1 && (
                  <div className="absolute inset-y-0 inset-x-2 flex items-center justify-between pointer-events-none">
                    <button
                      onClick={prevSlide}
                      className="p-2 rounded-full bg-[#080b14]/80 text-white hover:text-[#d4ff32] hover:bg-[#080b14] border border-[#273153] pointer-events-auto transition-all"
                      aria-label="Previous slide"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={nextSlide}
                      className="p-2 rounded-full bg-[#080b14]/80 text-white hover:text-[#d4ff32] hover:bg-[#080b14] border border-[#273153] pointer-events-auto transition-all"
                      aria-label="Next slide"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Bottom Carousel Title & Slide Dots */}
              <div className="mt-3.5 px-4 py-3 bg-[#0d1222] rounded-xl border border-[#273153] flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
                <div className="text-white font-bold truncate flex items-center gap-1.5">
                  {(currentSlide?.mediaType === 'video' || currentSlide?.videoUrl) && (
                    <span className="p-1 rounded bg-[#d4ff32]/20 text-[#d4ff32]"><Play className="w-3 h-3 fill-current" /></span>
                  )}
                  <span>{currentSlide?.title || 'ANKOBENG MOTORS'}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex gap-1.5">
                    {activeSlides.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentSlideIndex(idx)}
                        aria-label={`Go to slide ${idx + 1}`}
                        className={`w-2 h-2 rounded-full transition-all ${
                          idx === currentSlideIndex ? 'bg-[#d4ff32] w-4' : 'bg-slate-600 hover:bg-slate-400'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
