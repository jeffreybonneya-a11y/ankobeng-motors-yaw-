import React from 'react';
import { MapPin, Mail, Phone, ShieldCheck } from 'lucide-react';
import { BusinessInfo } from '../types';

interface FooterProps {
  businessInfo: BusinessInfo;
  onNavigate: (view: string, filter?: string) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  businessInfo,
  onNavigate,
  onOpenAdmin
}) => {
  return (
    <footer className="bg-[#05070e] border-t border-[#273153] text-slate-400 py-14 text-xs font-mono" data-purpose="site-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Identity */}
          <div className="space-y-3.5">
            <div>
              <div className="text-white font-black tracking-wider uppercase text-base font-heading">
                {businessInfo.name}
              </div>
              <div className="text-[10px] text-[#d4ff32] font-mono font-bold tracking-widest uppercase">
                {businessInfo.owner}
              </div>
            </div>
            <p className="font-mono text-xs text-slate-300 font-bold">
              {businessInfo.description}
            </p>
            <p className="text-[11px] leading-relaxed text-slate-400">
              Direct stockists of Opel engines, complete cylinder blocks, transmissions, crankshafts, and precision mechanical spares based at Abossey Okai, Accra.
            </p>
          </div>

          {/* Col 2: Hub Location & Contact */}
          <div className="space-y-2 font-mono text-[11px]">
            <h4 className="text-white font-extrabold uppercase tracking-wider text-xs">
              HUB LOCATION &amp; CONTACT
            </h4>
            <div className="space-y-2 text-slate-300 pt-1">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#d4ff32] shrink-0 mt-0.5" />
                <span>{businessInfo.location} ({businessInfo.shopDoor})</span>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="w-3.5 h-3.5 text-[#d4ff32] shrink-0 mt-0.5" />
                <span>{businessInfo.address}</span>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="w-3.5 h-3.5 text-[#d4ff32] shrink-0 mt-0.5" />
                <div className="text-[#d4ff32] font-bold space-x-2">
                  <a href={`tel:${businessInfo.phones[0]}`} className="hover:underline">{businessInfo.phones[0]}</a>
                  <span>/</span>
                  <a href={`tel:${businessInfo.phones[1]}`} className="hover:underline">{businessInfo.phones[1]}</a>
                </div>
              </div>
            </div>
          </div>

          {/* Col 3: Stock Registry */}
          <div className="space-y-2 font-mono text-[11px]">
            <h4 className="text-white font-extrabold uppercase tracking-wider text-xs">
              STOCK REGISTRY
            </h4>
            <ul className="space-y-1.5 text-slate-400 pt-1">
              <li>
                <button onClick={() => onNavigate('catalogue', 'Engines')} className="hover:text-[#d4ff32] transition-colors text-left">
                  • Opel Complete Engines
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalogue', 'Engine Parts')} className="hover:text-[#d4ff32] transition-colors text-left">
                  • Cylinder Heads &amp; Valves
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalogue', 'Engine Parts')} className="hover:text-[#d4ff32] transition-colors text-left">
                  • Crankshafts &amp; Camshafts
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalogue', 'Engines')} className="hover:text-[#d4ff32] transition-colors text-left">
                  • Astra / Vectra / Aveo Powertrains
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalogue', 'Engine Parts')} className="hover:text-[#d4ff32] transition-colors text-left">
                  • Gearboxes &amp; Transmission Units
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Trade Utilities */}
          <div className="space-y-2 font-mono text-[11px]">
            <h4 className="text-white font-extrabold uppercase tracking-wider text-xs">
              TRADE UTILITIES
            </h4>
            <ul className="space-y-1.5 text-slate-400 pt-1">
              <li>
                <button onClick={() => onNavigate('how-to-order')} className="hover:text-[#d4ff32] transition-colors text-left">
                  • Ordering Protocol
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-[#d4ff32] transition-colors text-left">
                  • Contact &amp; Location
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-[#d4ff32] transition-colors text-left">
                  • Physical Shop Verification
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-[#d4ff32] transition-colors text-left">
                  • In-Shop Collection ({businessInfo.shopDoor})
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="pt-6 border-t border-[#273153] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[10px] text-slate-400">
          <div className="flex flex-wrap items-center gap-2">
            <span>© {new Date().getFullYear()} {businessInfo.name} ({businessInfo.owner}). ALL RIGHTS RESERVED.</span>
            <span className="text-slate-600 hidden sm:inline">&bull;</span>
            <button
              onClick={() => onNavigate('admin')}
              className="text-slate-400 hover:text-[#d4ff32] flex items-center gap-1 transition-colors cursor-pointer"
              title="Store Management Portal (/admin)"
            >
              <ShieldCheck className="w-3 h-3 text-[#d4ff32]" />
              <span>Staff Portal (/admin)</span>
            </button>
          </div>
          <div className="text-[#d4ff32] font-bold">
            ABOSSEY OKAI COMMERCE HUB • ACCRA, GHANA
          </div>
        </div>
      </div>
    </footer>
  );
};
