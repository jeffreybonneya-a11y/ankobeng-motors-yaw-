import React from 'react';
import { MapPin, Mail, Phone, Clock, ShieldCheck, ShoppingBag, ArrowRight } from 'lucide-react';
import { BusinessInfo } from '../types';
import { STOREFRONT_IMAGE, STOREFRONT_IMAGE_INTERIOR } from '../services/dataService';

interface ContactViewProps {
  businessInfo: BusinessInfo;
  onOpenOrder: () => void;
}

export const ContactView: React.FC<ContactViewProps> = ({
  businessInfo,
  onOpenOrder
}) => {
  return (
    <section className="py-16 bg-[#080b14] border-b border-[#273153]" id="contact" data-purpose="contact-hub">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="tech-mono text-xs text-[#d4ff32] font-bold tracking-widest uppercase">
            COMMERCIAL HUB &amp; WAREHOUSE
          </div>
          <h2 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight font-heading">
            CONTACT ANKOBENG MOTORS
          </h2>
          <p className="text-sm text-slate-300">
            Visit our physical shop at Abossey Okai or contact Joseph Obeng Anderson directly for real-time stock verification and engine collection.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Store Details Cards */}
          <div className="lg:col-span-6 space-y-4 font-mono text-xs">
            <div className="p-6 bg-[#13192f] border border-[#273153] rounded-2xl space-y-4 shadow-lg">
              <div className="flex items-center gap-2 text-[#d4ff32] font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>BUSINESS &amp; LEAD IDENTITY</span>
              </div>
              <div className="space-y-1 border-b border-[#273153] pb-4">
                <div className="text-lg font-black text-white">{businessInfo.name}</div>
                <div className="text-[#d4ff32] font-bold">{businessInfo.owner}</div>
                <div className="text-slate-400 text-xs">{businessInfo.description}</div>
              </div>

              <div className="space-y-3 pt-1">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#d4ff32] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-white font-bold block">HUB LOCATION:</span>
                    <span className="text-slate-300">{businessInfo.location} ({businessInfo.shopDoor})</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#d4ff32] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-white font-bold block">POSTAL ADDRESS:</span>
                    <span className="text-slate-300">{businessInfo.address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#d4ff32] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-white font-bold block">DIRECT TELEPHONE:</span>
                    <div className="space-x-3 text-slate-200">
                      <a href={`tel:${businessInfo.phones[0]}`} className="text-[#d4ff32] font-bold hover:underline">
                        {businessInfo.phones[0]}
                      </a>
                      <span>/</span>
                      <a href={`tel:${businessInfo.phones[1]}`} className="text-[#d4ff32] font-bold hover:underline">
                        {businessInfo.phones[1]}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#d4ff32] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-white font-bold block">PHYSICAL SHOP ACCESS:</span>
                    <span className="text-slate-300">Abossey Okai, Accra, Ghana</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onOpenOrder}
                  className="w-full py-3 bg-[#d4ff32] hover:bg-[#c1ec25] text-[#080b14] font-bold uppercase rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>PLACE ORDER</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Store Visual Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="rounded-2xl overflow-hidden border border-[#273153] bg-black shadow-lg">
              <img
                src={STOREFRONT_IMAGE}
                alt="Ankobeng Motors Storefront at Abossey Okai"
                className="w-full h-auto object-cover"
              />
              <div className="p-4 bg-[#13192f] border-t border-[#273153] flex items-center justify-between tech-mono text-xs">
                <span className="text-white font-bold">STOREFRONT IDENTIFIER</span>
                <span className="text-[#d4ff32] font-bold">{businessInfo.shopDoor}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
