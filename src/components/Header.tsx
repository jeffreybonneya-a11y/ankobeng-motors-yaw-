import React, { useState } from 'react';
import { PhoneCall, Menu, X, Search, ShoppingBag, ShieldCheck } from 'lucide-react';
import { BusinessInfo } from '../types';

interface HeaderProps {
  businessInfo: BusinessInfo;
  currentView: string;
  onNavigate: (view: string, filter?: string) => void;
  onOpenOrder: (productName?: string) => void;
  onOpenAdmin: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  businessInfo,
  currentView,
  onNavigate,
  onOpenOrder,
  onOpenAdmin,
  searchTerm,
  onSearchChange
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);

  const handleNavClick = (view: string, filter?: string) => {
    onNavigate(view, filter);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#080b14]/95 backdrop-blur-md border-b border-[#273153]" data-purpose="site-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Identity - Clean text only, no generated fake logo */}
          <button 
            onClick={() => handleNavClick('home')}
            className="flex flex-col text-left group focus:outline-none"
          >
            <span className="text-xl sm:text-2xl font-black tracking-wider text-white uppercase leading-none font-heading group-hover:text-[#d4ff32] transition-colors">
              {businessInfo.name}
            </span>
            <span className="text-[11px] text-[#d4ff32] font-mono uppercase tracking-widest mt-1">
              {businessInfo.owner}
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold uppercase tracking-wider tech-mono">
            <button
              onClick={() => handleNavClick('home')}
              className={`pb-1 transition-colors ${currentView === 'home' ? 'text-[#d4ff32] border-b-2 border-[#d4ff32]' : 'text-slate-300 hover:text-white'}`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('catalogue', 'Engines')}
              className={`pb-1 transition-colors ${currentView === 'catalogue' ? 'text-[#d4ff32] border-b-2 border-[#d4ff32]' : 'text-slate-300 hover:text-white'}`}
            >
              Engines
            </button>
            <button
              onClick={() => handleNavClick('catalogue', 'Engine Parts')}
              className="text-slate-300 hover:text-white pb-1 transition-colors"
            >
              Engine Parts
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className={`pb-1 transition-colors ${currentView === 'about' ? 'text-[#d4ff32] border-b-2 border-[#d4ff32]' : 'text-slate-300 hover:text-white'}`}
            >
              About Us
            </button>
            <button
              onClick={() => handleNavClick('how-to-order')}
              className={`pb-1 transition-colors ${currentView === 'how-to-order' ? 'text-[#d4ff32] border-b-2 border-[#d4ff32]' : 'text-slate-300 hover:text-white'}`}
            >
              How To Order
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className={`pb-1 transition-colors ${currentView === 'contact' ? 'text-[#d4ff32] border-b-2 border-[#d4ff32]' : 'text-slate-300 hover:text-white'}`}
            >
              Contact
            </button>
          </nav>

          {/* Right Header CTAs */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Live Search Toggle on Desktop */}
            <div className="relative hidden md:block">
              {showSearchInput ? (
                <div className="flex items-center bg-[#13192f] border border-[#273153] rounded-lg px-2.5 py-1.5">
                  <Search className="w-4 h-4 text-slate-400 mr-2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search catalogue..."
                    className="bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none w-36 lg:w-48"
                    autoFocus
                  />
                  <button 
                    onClick={() => { setShowSearchInput(false); onSearchChange(''); }}
                    className="text-slate-400 hover:text-white ml-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setShowSearchInput(true);
                    if (currentView !== 'catalogue' && currentView !== 'home') {
                      onNavigate('catalogue');
                    }
                  }}
                  className="p-2 text-slate-300 hover:text-white hover:bg-[#13192f] rounded-lg border border-[#273153] transition-colors"
                  title="Search products"
                >
                  <Search className="w-4 h-4 text-[#d4ff32]" />
                </button>
              )}
            </div>

            {/* Direct Phone Dialers */}
            <a
              href={`tel:${businessInfo.phones[0]}`}
              className="hidden xl:flex items-center gap-2 text-xs font-mono text-slate-200 bg-[#0d1222] hover:bg-[#13192f] py-2 px-3 rounded-lg border border-[#273153] transition-colors"
              title="Call direct"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#d4ff32]" />
              <span>{businessInfo.phones[0]} / {businessInfo.phones[1]}</span>
            </a>

            {/* Place Order CTA */}
            <button
              onClick={() => onOpenOrder()}
              className="bg-[#d4ff32] hover:bg-[#c1ec25] text-[#080b14] px-4 sm:px-5 py-2 sm:py-2.5 rounded font-mono text-xs uppercase tracking-wider font-extrabold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>PLACE ORDER</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-300 hover:text-white bg-[#13192f] border border-[#273153] rounded-lg"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0d1222] border-b border-[#273153] px-4 pt-3 pb-6 space-y-4">
          {/* Mobile Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                onSearchChange(e.target.value);
                if (currentView !== 'catalogue' && currentView !== 'home') {
                  onNavigate('catalogue');
                }
              }}
              placeholder="Search engine or part name..."
              className="w-full pl-9 pr-4 py-2.5 bg-[#13192f] border border-[#273153] rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#d4ff32]"
            />
          </div>

          {/* Mobile Navigation Links */}
          <nav className="flex flex-col space-y-1 tech-mono text-xs uppercase font-bold">
            <button
              onClick={() => handleNavClick('home')}
              className={`text-left py-2.5 px-3 rounded-lg transition-colors ${currentView === 'home' ? 'bg-[#13192f] text-[#d4ff32]' : 'text-slate-200 hover:bg-[#13192f]'}`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('catalogue', 'Engines')}
              className={`text-left py-2.5 px-3 rounded-lg transition-colors ${currentView === 'catalogue' ? 'bg-[#13192f] text-[#d4ff32]' : 'text-slate-200 hover:bg-[#13192f]'}`}
            >
              Engines Catalogue
            </button>
            <button
              onClick={() => handleNavClick('catalogue', 'Engine Parts')}
              className="text-left py-2.5 px-3 rounded-lg text-slate-200 hover:bg-[#13192f] transition-colors"
            >
              Engine Parts
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className={`text-left py-2.5 px-3 rounded-lg transition-colors ${currentView === 'about' ? 'bg-[#13192f] text-[#d4ff32]' : 'text-slate-200 hover:bg-[#13192f]'}`}
            >
              About Ankobeng Motors
            </button>
            <button
              onClick={() => handleNavClick('how-to-order')}
              className={`text-left py-2.5 px-3 rounded-lg transition-colors ${currentView === 'how-to-order' ? 'bg-[#13192f] text-[#d4ff32]' : 'text-slate-200 hover:bg-[#13192f]'}`}
            >
              How To Order
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className={`text-left py-2.5 px-3 rounded-lg transition-colors ${currentView === 'contact' ? 'bg-[#13192f] text-[#d4ff32]' : 'text-slate-200 hover:bg-[#13192f]'}`}
            >
              Contact & Location
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenOrder();
              }}
              className="w-full mt-2 py-3 bg-[#d4ff32] hover:bg-[#c1ec25] text-[#080b14] text-center rounded font-mono text-xs uppercase font-extrabold flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>PLACE ORDER</span>
            </button>
          </nav>

          {/* Direct Phone Dialers for Mobile */}
          <div className="pt-2 border-t border-[#273153] space-y-2">
            <div className="text-[11px] font-mono text-slate-400">Direct Shop Phone Lines:</div>
            <div className="grid grid-cols-2 gap-2">
              <a
                href={`tel:${businessInfo.phones[0]}`}
                className="flex items-center justify-center gap-1.5 py-2.5 bg-[#13192f] text-[#d4ff32] border border-[#273153] rounded text-xs font-mono font-bold"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{businessInfo.phones[0]}</span>
              </a>
              <a
                href={`tel:${businessInfo.phones[1]}`}
                className="flex items-center justify-center gap-1.5 py-2.5 bg-[#13192f] text-[#d4ff32] border border-[#273153] rounded text-xs font-mono font-bold"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{businessInfo.phones[1]}</span>
              </a>
            </div>
          </div>

          <div className="pt-2 flex justify-between items-center text-xs font-mono text-slate-400">
            <span className="text-[11px] text-slate-400">ANKOBENG MOTORS ACCRA</span>
            <span className="text-[10px] text-[#d4ff32] font-bold">{businessInfo.shopDoor}</span>
          </div>
        </div>
      )}
    </header>
  );
};
