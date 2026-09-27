import React from 'react';
import { MapPin, Mail, Phone, ShieldCheck, ShoppingBag, ExternalLink, Navigation } from 'lucide-react';
import { BusinessInfo, HomepageContent } from '../types';
import { STOREFRONT_IMAGE } from '../services/dataService';
import { OptimizedImage } from './OptimizedImage';

interface ContactViewProps {
  businessInfo: BusinessInfo;
  homepageContent?: HomepageContent;
  onOpenOrder: () => void;
}

export const ContactView: React.FC<ContactViewProps> = ({
  businessInfo,
  homepageContent,
  onOpenOrder
}) => {
  const storefrontImg = homepageContent?.homepageBackgroundImage || STOREFRONT_IMAGE;
  const mapCoordinates = '5.547731,-0.217733';
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapCoordinates}`;
  const embedMapUrl = `https://maps.google.com/maps?q=${mapCoordinates}&hl=en&z=16&output=embed`;

  return (
    <section className="py-16 bg-[#080b14] border-b border-[#273153]" id="contact" data-purpose="contact-hub">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="tech-mono text-xs text-[#d4ff32] font-bold tracking-widest uppercase flex items-center justify-center gap-2">
            <Navigation className="w-3.5 h-3.5 text-[#d4ff32]" />
            <span>COMMERCIAL HUB &amp; PHYSICAL LOCATION</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight font-heading">
            CONTACT ANKOBENG MOTORS
          </h2>
          <p className="text-sm text-slate-300">
            Visit our physical shop at Abossey Okai or contact Joseph Obeng Anderson directly for real-time stock verification and engine collection.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Business Information & Contact Details */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6 font-mono text-xs">
            <div className="p-6 bg-[#13192f] border border-[#273153] rounded-2xl space-y-5 shadow-lg flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[#d4ff32] font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>BUSINESS &amp; DIRECT DEALER CONTACT</span>
                </div>

                <div className="space-y-1.5 border-b border-[#273153] pb-4">
                  <div className="text-xl font-black text-white font-heading">{businessInfo.name || 'ANKOBENG MOTORS'}</div>
                  <div className="text-[#d4ff32] font-bold text-sm">{businessInfo.owner || 'JOSEPH OBENG ANDERSON'}</div>
                  <div className="text-slate-300 font-semibold text-xs tracking-wide">
                    {businessInfo.description || 'DEALERS IN OPEL ENGINES & ALL KINDS OF ENGINE PARTS'}
                  </div>
                </div>

                <div className="space-y-4 pt-1">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-[#d4ff32] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-white font-bold block">LOCATION ADDRESS:</span>
                      <span className="text-slate-200 block font-sans text-sm mt-0.5">
                        near the post office, ABOSSEY OKAI – ACCRA
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-[#d4ff32] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-white font-bold block">POSTAL ADDRESS:</span>
                      <span className="text-slate-200 block font-sans text-sm mt-0.5">
                        BOX KN4009
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-[#d4ff32] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-white font-bold block">PHONE NUMBERS:</span>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-sans font-bold text-[#d4ff32] mt-0.5">
                        <a href="tel:0243324183" className="hover:underline focus:outline-none focus:ring-1 focus:ring-[#d4ff32] rounded px-1 -mx-1">
                          0243324183
                        </a>
                        <span className="text-slate-500 font-normal">/</span>
                        <a href="tel:0538988846" className="hover:underline focus:outline-none focus:ring-1 focus:ring-[#d4ff32] rounded px-1 -mx-1">
                          0538988846
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-[#273153]">
                {/* Storefront visual thumbnail */}
                <div className="rounded-xl overflow-hidden border border-[#273153] bg-black aspect-[16/9] relative group">
                  <OptimizedImage
                    src={storefrontImg}
                    alt="Ankobeng Motors Storefront at Abossey Okai"
                    priority={false}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                    <span className="text-white font-bold text-[11px] font-mono tracking-wider">
                      STOREFRONT &amp; WAREHOUSE
                    </span>
                  </div>
                </div>

                <button
                  onClick={onOpenOrder}
                  className="w-full py-3.5 bg-[#d4ff32] hover:bg-[#c1ec25] text-[#080b14] font-bold text-sm uppercase rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#d4ff32] focus:ring-offset-2 focus:ring-offset-[#080b14]"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>PLACE ORDER / INQUIRE PARTS</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Map & Location Hub */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            <div className="p-6 bg-[#13192f] border border-[#273153] rounded-2xl space-y-5 shadow-lg flex-1 flex flex-col">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#273153] pb-4">
                <div>
                  <div className="text-xs text-[#d4ff32] font-mono font-bold tracking-wider uppercase">
                    INTERACTIVE MAP
                  </div>
                  <h3 className="text-xl font-black text-white font-heading uppercase">
                    OUR LOCATION
                  </h3>
                </div>
                <div className="text-slate-400 font-mono text-[11px] bg-[#080b14] px-3 py-1.5 rounded-lg border border-[#273153] self-start sm:self-center">
                  GPS: <span className="text-[#d4ff32] font-bold">5.547731, -0.217733</span>
                </div>
              </div>

              {/* Map Iframe Container */}
              <div className="relative w-full h-[360px] sm:h-[420px] rounded-xl overflow-hidden border border-[#273153] bg-[#080b14] shadow-inner flex-1">
                <iframe
                  title="ANKOBENG MOTORS location map"
                  src={embedMapUrl}
                  className="w-full h-full border-0"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>

              {/* Action Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-300 font-mono">
                  Near Post Office, Abossey Okai, Accra Metropolitan District, Ghana
                </div>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3 bg-[#18203d] hover:bg-[#202a50] text-[#d4ff32] border border-[#d4ff32]/40 hover:border-[#d4ff32] font-bold text-xs uppercase rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shrink-0 focus:outline-none focus:ring-2 focus:ring-[#d4ff32] focus:ring-offset-2 focus:ring-offset-[#080b14]"
                >
                  <MapPin className="w-4 h-4 text-[#d4ff32]" />
                  <span>OPEN IN GOOGLE MAPS</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-0.5 opacity-80" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

