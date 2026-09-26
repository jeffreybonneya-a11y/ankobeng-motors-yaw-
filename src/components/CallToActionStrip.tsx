import React from 'react';
import { Wrench, Phone, ShoppingBag } from 'lucide-react';
import { BusinessInfo, VideoSettings } from '../types';
import { MediaVideoPlayer } from './MediaVideoPlayer';

interface CallToActionStripProps {
  businessInfo: BusinessInfo;
  headline?: string;
  description?: string;
  video?: VideoSettings;
  onOpenOrder: () => void;
}

export const CallToActionStrip: React.FC<CallToActionStripProps> = ({
  businessInfo,
  headline,
  description,
  video,
  onOpenOrder
}) => {
  return (
    <section className="bg-[#13192f] border-t border-[#273153] py-10" data-purpose="immediate-assistance-strip">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {video && video.enabled && (
          <div className="max-w-3xl mx-auto rounded-2xl overflow-hidden border border-[#273153] bg-black shadow-xl">
            <MediaVideoPlayer video={video} className="w-full aspect-video" />
          </div>
        )}

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="tech-mono text-xs text-[#d4ff32] font-bold uppercase flex items-center justify-center md:justify-start gap-1.5">
              <Wrench className="w-3.5 h-3.5" /> MECHANICAL ENQUIRIES &amp; SOURCING
            </div>
            <h3 className="text-xl sm:text-2xl font-black uppercase text-white font-heading">
              {headline || 'LOOKING FOR A SPECIFIC ENGINE?'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              {description || 'Tell us what you need and contact Ankobeng Motors for the engine or engine part you are looking for. Direct stock availability at Abossey Okai.'}
            </p>
            <div className="tech-mono text-[11px] text-slate-400 pt-1">
              {businessInfo.address} • {businessInfo.location}
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenOrder}
              className="bg-[#d4ff32] hover:bg-[#c1ec25] text-[#080b14] px-5 sm:px-6 py-3 sm:py-3.5 rounded font-mono text-xs font-extrabold uppercase tracking-wider transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>PLACE ORDER</span>
            </button>
            <a
              href={`tel:${businessInfo.phones[0]}`}
              className="border border-white/20 hover:border-[#d4ff32]/50 bg-[#0d1222] hover:bg-[#18203d] text-white px-5 sm:px-6 py-3 sm:py-3.5 rounded font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors"
            >
              <Phone className="w-4 h-4 text-[#d4ff32]" />
              <span>CALL {businessInfo.phones[0]}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
