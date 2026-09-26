import React from 'react';
import { ArrowRight, Search, CheckCircle, PackageCheck } from 'lucide-react';

interface HowToOrderProps {
  onExploreEngines: () => void;
  onOpenOrder: () => void;
}

export const HowToOrderSection: React.FC<HowToOrderProps> = ({
  onExploreEngines,
  onOpenOrder
}) => {
  return (
    <section className="py-16 bg-[#080b14]" id="how-to-order" data-purpose="order-process-steps">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <div className="tech-mono text-xs text-[#d4ff32] font-bold tracking-widest uppercase">
            STREAMLINED ACQUISITION PROCESS
          </div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight font-heading">
            HOW TO ORDER FROM ANKOBENG MOTORS
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Three simple steps to secure Opel powertrains and engine components with full transparency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div 
            onClick={onExploreEngines}
            className="p-7 bg-[#13192f] rounded-2xl border border-[#273153] relative space-y-4 hover:border-[#d4ff32]/60 transition-all cursor-pointer group shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="text-4xl sm:text-5xl font-black text-[#d4ff32]/40 group-hover:text-[#d4ff32] transition-colors font-mono">
                01
              </div>
              <div className="w-10 h-10 rounded-lg bg-[#0d1222] border border-[#273153] flex items-center justify-center text-[#d4ff32]">
                <Search className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-lg font-black uppercase text-white tracking-wide font-heading">
              FIND YOUR ENGINE
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Browse available engines and engine parts online or call our direct shop lines with your Opel vehicle model, year, and specifications.
            </p>
            <div className="pt-2 text-[11px] font-mono text-[#d4ff32] font-bold flex items-center gap-1.5">
              <span>ONLINE OR DIRECT TELEPHONE</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-7 bg-[#13192f] rounded-2xl border border-[#273153] relative space-y-4 hover:border-[#d4ff32]/60 transition-all group shadow-md">
            <div className="flex items-center justify-between">
              <div className="text-4xl sm:text-5xl font-black text-[#d4ff32]/40 group-hover:text-[#d4ff32] transition-colors font-mono">
                02
              </div>
              <div className="w-10 h-10 rounded-lg bg-[#0d1222] border border-[#273153] flex items-center justify-center text-[#d4ff32]">
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-lg font-black uppercase text-white tracking-wide font-heading">
              CHECK THE DETAILS
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Review product specifications, physical condition, and fitment with Joseph Obeng Anderson and our Abossey Okai technicians.
            </p>
            <div className="pt-2 text-[11px] font-mono text-[#d4ff32] font-bold flex items-center gap-1.5">
              <span>SPECIFICATION CLEARANCE</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Step 3 */}
          <div 
            onClick={onOpenOrder}
            className="p-7 bg-[#13192f] rounded-2xl border border-[#273153] relative space-y-4 hover:border-[#d4ff32]/60 transition-all cursor-pointer group shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="text-4xl sm:text-5xl font-black text-[#d4ff32]/40 group-hover:text-[#d4ff32] transition-colors font-mono">
                03
              </div>
              <div className="w-10 h-10 rounded-lg bg-[#0d1222] border border-[#273153] flex items-center justify-center text-[#d4ff32]">
                <PackageCheck className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-lg font-black uppercase text-white tracking-wide font-heading">
              PLACE YOUR ORDER
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Click Place Order to contact Ankobeng Motors directly on WhatsApp with your selected product pre-filled.
            </p>
            <div className="pt-2 text-[11px] font-mono text-[#d4ff32] font-bold flex items-center gap-1.5">
              <span>DIRECT WHATSAPP ORDER</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
