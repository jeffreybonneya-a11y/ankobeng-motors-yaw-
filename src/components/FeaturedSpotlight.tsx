import React, { useState } from 'react';
import { ShieldCheck, ChevronLeft, ChevronRight, FileText, ShoppingBag } from 'lucide-react';
import { Product, VideoSettings } from '../types';
import { MediaVideoPlayer } from './MediaVideoPlayer';

interface FeaturedSpotlightProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  video?: VideoSettings;
  onOpenOrder: (productName: string) => void;
  onOpenDetails: (product: Product) => void;
}

export const FeaturedSpotlight: React.FC<FeaturedSpotlightProps> = ({
  products,
  title,
  subtitle,
  video,
  onOpenOrder,
  onOpenDetails
}) => {
  const featuredProducts = products.filter(p => p.featured);
  const displayItems = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 3);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentItem = displayItems[currentIndex] || displayItems[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + displayItems.length) % displayItems.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % displayItems.length);
  };

  if (!currentItem) return null;

  return (
    <section className="py-14 bg-gradient-to-b from-[#080b14] via-[#0d1222] to-[#080b14] border-b border-[#273153]" data-purpose="featured-engine-spotlight">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[#273153] gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#d4ff32] font-mono text-xs uppercase tracking-wider mb-1 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>SHOP DOOR E-3 • ABOSSEY OKAI STOCK</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-heading">
              {title || 'FEATURED ENGINES'}
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              {subtitle || 'Opel Powertrains & Components Available for Immediate Collection or Regional Transport'}
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
            <button
              onClick={handlePrev}
              className="p-2 border border-[#273153] rounded hover:bg-[#13192f] text-slate-300 hover:text-white transition-colors"
              aria-label="Previous featured engine"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 text-[#d4ff32] font-bold">
              {String(currentIndex + 1).padStart(2, '0')} / {String(displayItems.length).padStart(2, '0')}
            </span>
            <button
              onClick={handleNext}
              className="p-2 border border-[#273153] rounded hover:bg-[#13192f] text-slate-300 hover:text-white transition-colors"
              aria-label="Next featured engine"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Featured Card Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-[#13192f] p-6 sm:p-8 rounded-2xl border border-[#273153] items-center shadow-lg">
          {/* Media Slot: Either Video Player or Product Specimen Image */}
          <div className="lg:col-span-5 relative">
            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#080b14] border border-[#273153] flex items-center justify-center p-2 relative group">
              {video && video.enabled ? (
                <MediaVideoPlayer
                  video={video}
                  className="w-full h-full rounded-lg"
                  fallbackImage={currentItem.images[0]}
                />
              ) : (
                <img
                  src={currentItem.images[0]}
                  alt={currentItem.name}
                  className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-500"
                />
              )}
              <span className="absolute top-4 left-4 bg-[#d4ff32] text-[#080b14] font-mono text-[10px] font-extrabold px-2.5 py-1 rounded uppercase tracking-wider">
                {video && video.enabled ? (video.title || 'VIDEO SPOTLIGHT') : currentItem.availability}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-7 space-y-4">
            <div className="tech-mono text-xs text-[#d4ff32] font-bold">
              SHOP DOOR E-3 • ABOSSEY OKAI
            </div>
            <h3 className="text-xl sm:text-2xl font-black uppercase text-white tracking-wide font-heading">
              {currentItem.name}
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              {currentItem.description || 'Complete assembly with mounting points, intake components, and engine wiring.'}
            </p>

            <div className="grid grid-cols-2 gap-4 py-3.5 border-y border-[#273153] font-mono text-xs">
              <div>
                <span className="block text-slate-400 uppercase text-[10px]">CATEGORY</span>
                <span className="text-white font-semibold">{currentItem.category}</span>
              </div>
              <div>
                <span className="block text-slate-400 uppercase text-[10px]">FITMENT</span>
                <span className="text-white font-semibold">{currentItem.fitment || 'Opel / GM Platforms'}</span>
              </div>
              <div>
                <span className="block text-slate-400 uppercase text-[10px]">CONDITION</span>
                <span className="text-[#d4ff32] font-bold">{currentItem.condition || 'Shop Stock'}</span>
              </div>
              <div>
                <span className="block text-slate-400 uppercase text-[10px]">COLLECTION</span>
                <span className="text-white font-semibold">Shop Door E-3, Abossey Okai</span>
              </div>
            </div>

            {/* Direct WhatsApp Order Action */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onOpenOrder(currentItem.name)}
                className="bg-[#d4ff32] hover:bg-[#c1ec25] text-[#080b14] px-6 py-3 rounded font-mono text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-sm hover:scale-[1.02]"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>PLACE ORDER</span>
              </button>
              <button
                onClick={() => onOpenDetails(currentItem)}
                className="bg-[#080b14] hover:bg-[#18203d] text-white border border-[#273153] hover:border-[#d4ff32]/60 px-5 py-3 rounded font-mono text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-slate-400" />
                <span>INSPECT SPECIFICATIONS</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
