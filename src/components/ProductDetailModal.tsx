import React, { useState } from 'react';
import { X, ShoppingBag, PhoneCall, Check, MapPin, Play, Image as ImageIcon } from 'lucide-react';
import { Product, BusinessInfo } from '../types';
import { OptimizedImage } from './OptimizedImage';

interface ProductDetailModalProps {
  product: Product | null;
  businessInfo: BusinessInfo;
  onClose: () => void;
  onOpenOrder: (productName: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  businessInfo,
  onClose,
  onOpenOrder
}) => {
  if (!product) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  const images = product.images.length > 0 ? product.images : [];
  const activeImage = images[activeImageIndex] || images[0];
  const hasVideo = !!product.videoUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-[#0d1222] border border-[#273153] rounded-2xl overflow-hidden shadow-2xl my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-[#13192f] border-b border-[#273153] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-[#d4ff32] uppercase font-bold tracking-wider">
              {product.category} • {product.availability}
            </span>
            <h3 className="text-lg sm:text-xl font-black uppercase text-white font-heading">
              {product.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-[#0d1222] rounded-lg border border-[#273153] transition-colors cursor-pointer"
            aria-label="Close product details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Main Media Display (Image or Video) */}
          <div className="space-y-3">
            <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-xl overflow-hidden bg-black border border-[#273153] flex items-center justify-center">
              {showVideo && hasVideo ? (
                <video
                  src={product.videoUrl}
                  controls
                  autoPlay
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover"
                />
              ) : activeImage ? (
                <OptimizedImage
                  src={activeImage}
                  alt={product.name}
                  priority={true}
                  className="w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-500 font-mono text-xs">
                  No Image Available
                </div>
              )}
              <span className="absolute top-3 left-3 bg-[#d4ff32] text-[#080b14] font-mono text-[10px] font-extrabold px-2.5 py-1 rounded uppercase">
                {product.availability}
              </span>
            </div>

            {/* Media Selector (Thumbnails + Video Toggle) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {hasVideo && (
                <button
                  type="button"
                  onClick={() => setShowVideo(true)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-mono font-bold shrink-0 transition-all cursor-pointer ${
                    showVideo 
                      ? 'bg-[#d4ff32] text-[#080b14] border-[#d4ff32]' 
                      : 'bg-[#13192f] text-[#d4ff32] border-[#273153] hover:border-[#d4ff32]/60'
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Watch Video Clip {product.videoDuration ? `(${Math.round(product.videoDuration)}s)` : ''}</span>
                </button>
              )}

              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveImageIndex(idx);
                    setShowVideo(false);
                  }}
                  className={`relative w-20 h-14 rounded-lg overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                    !showVideo && idx === activeImageIndex ? 'border-[#d4ff32]' : 'border-[#273153] opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.name} view ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Description & Technical Specifications */}
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-mono uppercase text-slate-400 font-bold mb-1">PRODUCT OVERVIEW</h4>
              <p className="text-sm text-slate-200 leading-relaxed">
                {product.description || 'Verified engine assembly in store at Abossey Okai.'}
              </p>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-[#13192f] rounded-xl border border-[#273153] font-mono text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">PRODUCT NAME</span>
                <span className="text-white font-bold">{product.name}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">CATEGORY</span>
                <span className="text-[#d4ff32] font-semibold">{product.category}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">FITMENT / COMPATIBILITY</span>
                <span className="text-white font-semibold">{product.fitment || 'Opel / GM'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">STORAGE LOCATION</span>
                <span className="text-white font-semibold">{businessInfo.shopDoor}, {businessInfo.location}</span>
              </div>
            </div>

            {/* Shop Inspection Note */}
            <div className="p-3 bg-[#13192f] border border-[#273153] rounded-lg flex items-center gap-2.5 text-xs text-slate-300">
              <Check className="w-4 h-4 text-[#d4ff32] shrink-0" />
              <span>Available for in-person inspection at Shop Door E-3 before collection.</span>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 bg-[#13192f] border-t border-[#273153] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
            <MapPin className="w-4 h-4 text-[#d4ff32]" />
            <span>Abossey Okai Near Post Office</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href={`tel:${businessInfo.phones[0]}`}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-[#0d1222] hover:bg-[#18203d] text-white border border-[#273153] rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#d4ff32]" />
              <span>Call Direct</span>
            </a>
            <button
              onClick={() => {
                onClose();
                onOpenOrder(product.name);
              }}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-[#d4ff32] hover:bg-[#c1ec25] text-[#080b14] rounded-lg text-xs font-mono font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>PLACE ORDER</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
