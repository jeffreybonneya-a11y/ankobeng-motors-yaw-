import React from 'react';
import { MapPin, Wrench, ShieldCheck, Mail, Phone, Building } from 'lucide-react';
import { BusinessInfo, HomepageContent } from '../types';
import { STOREFRONT_IMAGE_INTERIOR } from '../services/dataService';
import { OptimizedImage } from './OptimizedImage';

interface AboutSectionProps {
  businessInfo: BusinessInfo;
  headline?: string;
  description?: string;
  homepageContent?: HomepageContent;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ 
  businessInfo,
  headline,
  description,
  homepageContent
}) => {
  const aboutMedia = homepageContent?.aboutMedia;
  const isVideo = aboutMedia?.enabled && aboutMedia?.type === 'video' && !!aboutMedia?.url;
  const isCustomImage = aboutMedia?.enabled && aboutMedia?.type === 'image' && !!aboutMedia?.url;
  const mediaUrl = isVideo ? aboutMedia.url : (isCustomImage ? aboutMedia.url : STOREFRONT_IMAGE_INTERIOR);

  return (
    <section className="py-16 bg-[#0d1222] border-t border-b border-[#273153] relative overflow-hidden" id="about-shop" data-purpose="shop-transparency">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Physical Store Imagery / Video Block */}
          <div className="lg:col-span-5 space-y-3">
            <div className="rounded-2xl overflow-hidden border border-[#273153] bg-black group shadow-lg aspect-[4/3] flex items-center justify-center">
              {isVideo ? (
                <video
                  src={mediaUrl}
                  poster={aboutMedia?.posterUrl}
                  autoPlay={aboutMedia?.autoplay ?? false}
                  muted={aboutMedia?.muted ?? true}
                  loop={aboutMedia?.loop ?? true}
                  controls={aboutMedia?.controls ?? true}
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover"
                />
              ) : (
                <OptimizedImage
                  src={mediaUrl}
                  alt="Actual Shop Location Shop Door E-3 Abossey Okai"
                  priority={false}
                  className="w-full h-full group-hover:scale-102 transition-transform duration-500"
                />
              )}
            </div>
            <div className="flex justify-between tech-mono text-xs text-slate-400 px-1 pt-1">
              <span className="font-bold text-slate-300">ACTUAL STORE LOCATION: {businessInfo.shopDoor}</span>
              <span className="text-[#d4ff32] font-bold">DIRECT WAREHOUSE ACCESS</span>
            </div>
          </div>

          {/* Right Store Details and Verification Credentials */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 tech-mono text-xs text-[#d4ff32] font-bold">
                <MapPin className="w-4 h-4" /> PHYSICAL SHOPPING &amp; VERIFICATION
              </div>
              <h2 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight font-heading">
                {headline || 'REAL ENGINES. REAL SHOP. REAL SERVICE.'}
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                {description || 'Every engine on our racks is physically stocked at our Abossey Okai store. Mechanics, fleet operators, and vehicle owners are welcome to inspect units directly before ordering.'}
              </p>
            </div>

            {/* Credential Table Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
              <div className="p-4 bg-[#13192f] rounded-xl border border-[#273153]">
                <span className="block text-slate-400 uppercase text-[10px] font-bold flex items-center gap-1 mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#d4ff32]" /> PROPRIETOR / LEAD
                </span>
                <span className="text-white font-extrabold text-sm block">{businessInfo.name}</span>
                <span className="text-[#d4ff32] font-bold">{businessInfo.owner}</span>
              </div>

              <div className="p-4 bg-[#13192f] rounded-xl border border-[#273153]">
                <span className="block text-slate-400 uppercase text-[10px] font-bold flex items-center gap-1 mb-1">
                  <Building className="w-3.5 h-3.5 text-[#d4ff32]" /> SPECIALIZATION
                </span>
                <span className="text-white font-extrabold text-sm block">OPEL ENGINES</span>
                <span className="text-slate-300">&amp; All Kinds of Engine Parts</span>
              </div>

              <div className="p-4 bg-[#13192f] rounded-xl border border-[#273153]">
                <span className="block text-slate-400 uppercase text-[10px] font-bold flex items-center gap-1 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-[#d4ff32]" /> PHYSICAL DISPATCH HUB
                </span>
                <span className="text-white font-bold">{businessInfo.location}</span>
                <span className="text-slate-300 block mt-0.5">Accra, Ghana ({businessInfo.shopDoor})</span>
              </div>

              <div className="p-4 bg-[#13192f] rounded-xl border border-[#273153]">
                <span className="block text-slate-400 uppercase text-[10px] font-bold flex items-center gap-1 mb-1">
                  <Mail className="w-3.5 h-3.5 text-[#d4ff32]" /> POSTAL ADDRESS &amp; CALLS
                </span>
                <span className="text-white font-bold">{businessInfo.address}</span>
                <div className="text-[#d4ff32] font-bold block mt-0.5 space-x-2">
                  <a href={`tel:${businessInfo.phones[0]}`} className="hover:underline">{businessInfo.phones[0]}</a>
                  <span>/</span>
                  <a href={`tel:${businessInfo.phones[1]}`} className="hover:underline">{businessInfo.phones[1]}</a>
                </div>
              </div>
            </div>

            {/* In-Shop Inspection Note */}
            <div className="p-4 bg-[#13192f] border border-[#273153] rounded-xl flex items-center gap-3.5 text-xs tech-mono text-slate-200">
              <div className="w-8 h-8 rounded-lg bg-[#d4ff32]/10 border border-[#d4ff32]/30 flex items-center justify-center shrink-0 text-[#d4ff32]">
                <Wrench className="w-4 h-4" />
              </div>
              <span>Mechanics can bring gauges, endoscopes, and diagnostic tools to verify cylinder bores and engine assemblies right in our shop before settlement.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
