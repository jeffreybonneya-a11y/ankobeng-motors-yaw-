import React, { useState, useEffect, useCallback } from 'react';
import { 
  Product, 
  Category, 
  HeroSlide, 
  BusinessInfo, 
  HomepageContent, 
  WhatsAppSettings, 
  MediaItem 
} from './types';
import { dataService, openWhatsAppOrder } from './services/dataService';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { FeaturedSpotlight } from './components/FeaturedSpotlight';
import { ProductCatalogue } from './components/ProductCatalogue';
import { ProductDetailModal } from './components/ProductDetailModal';
import { AboutSection } from './components/AboutSection';
import { HowToOrderSection } from './components/HowToOrderSection';
import { CallToActionStrip } from './components/CallToActionStrip';
import { ContactView } from './components/ContactView';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { ShieldCheck } from 'lucide-react';

const getInitialView = (): string => {
  if (typeof window === 'undefined') return 'home';
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase().replace('#', '');
  if (path === '/admin' || path.startsWith('/admin') || hash === 'admin') {
    return 'admin';
  }
  if (path === '/catalogue' || hash === 'engines' || hash === 'engine-parts') {
    return 'catalogue';
  }
  if (path === '/about' || hash === 'about' || hash === 'about-shop') {
    return 'about';
  }
  if (path === '/how-to-order' || hash === 'how-to-order') {
    return 'how-to-order';
  }
  if (path === '/contact' || hash === 'contact') {
    return 'contact';
  }
  return 'home';
};

export default function App() {
  // Application Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>(dataService.getBusinessInfo());
  const [homepageContent, setHomepageContent] = useState<HomepageContent>(dataService.getHomepageContent());
  const [whatsappSettings, setWhatsappSettings] = useState<WhatsAppSettings>(dataService.getWhatsAppSettings());
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(dataService.getMediaItems());

  // Navigation & View States
  const [currentView, setCurrentView] = useState<string>(getInitialView);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Modals
  const [selectedProductDetails, setSelectedProductDetails] = useState<Product | null>(null);

  // Reload data from service
  const loadData = useCallback(() => {
    setProducts(dataService.getProducts());
    setCategories(dataService.getCategories());
    setHeroSlides(dataService.getHeroSlides());
    setBusinessInfo(dataService.getBusinessInfo());
    setHomepageContent(dataService.getHomepageContent());
    setWhatsappSettings(dataService.getWhatsAppSettings());
    setMediaItems(dataService.getMediaItems());
  }, []);

  // Initialize data on mount & listen to route changes
  useEffect(() => {
    loadData();

    const handleUrlChange = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase().replace('#', '');

      if (path === '/admin' || path.startsWith('/admin') || hash === 'admin') {
        setCurrentView('admin');
        return;
      }

      if (hash === 'engines') {
        setCurrentView('catalogue');
        setSelectedCategory('engines');
      } else if (hash === 'engine-parts') {
        setCurrentView('catalogue');
        setSelectedCategory('engine-parts');
      } else if (hash === 'about-shop' || hash === 'about' || path === '/about') {
        setCurrentView('about');
      } else if (hash === 'how-to-order' || path === '/how-to-order') {
        setCurrentView('how-to-order');
      } else if (hash === 'contact' || path === '/contact') {
        setCurrentView('contact');
      } else if (path === '/catalogue') {
        setCurrentView('catalogue');
      } else if (path === '/' || path === '') {
        setCurrentView('home');
      }

      if (hash.startsWith('product-')) {
        const prodId = hash.replace('product-', '');
        const p = dataService.getProductById(prodId);
        if (p) setSelectedProductDetails(p);
      }
    };

    handleUrlChange();
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);

    // Keyboard shortcut for shop management (Ctrl+Alt+A or Cmd+Alt+A)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.altKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        setCurrentView(prev => {
          const next = prev === 'admin' ? 'home' : 'admin';
          const newPath = next === 'home' ? '/' : `/${next}`;
          if (window.location.pathname !== newPath) {
            window.history.pushState(null, '', newPath);
          }
          return next;
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [loadData]);

  // Navigation Handler
  const handleNavigate = (view: string, filter?: string) => {
    setCurrentView(view);
    const newPath = view === 'home' ? '/' : `/${view}`;
    if (window.location.pathname !== newPath) {
      window.history.pushState(null, '', newPath);
    }

    if (filter) {
      if (filter.toLowerCase().includes('engine') && !filter.toLowerCase().includes('part')) {
        setSelectedCategory('engines');
      } else if (filter.toLowerCase().includes('part')) {
        setSelectedCategory('engine-parts');
      } else {
        setSelectedCategory('all');
      }
    } else {
      setSelectedCategory('all');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Direct WhatsApp Order Handler - Directly launches WhatsApp with dynamic pre-filled message
  const handleOpenOrder = (productName?: string) => {
    openWhatsAppOrder(productName);
  };

  // ====================================================
  // 1. STANDALONE ADMIN DASHBOARD PAGE AT /admin
  // ====================================================
  if (currentView === 'admin') {
    return (
      <AdminDashboard
        products={products}
        categories={categories}
        heroSlides={heroSlides}
        businessInfo={businessInfo}
        homepageContent={homepageContent}
        whatsappSettings={whatsappSettings}
        mediaItems={mediaItems}
        isStandalonePage={true}
        onClose={() => handleNavigate('home')}
        onDataChanged={loadData}
      />
    );
  }

  // ====================================================
  // 2. PUBLIC ANKOBENG MOTORS STOREFRONT
  // ====================================================
  return (
    <div className="min-h-screen bg-[#080b14] text-slate-200 flex flex-col selection:bg-[#d4ff32] selection:text-[#080b14]">
      {/* Top Header */}
      <Header
        businessInfo={businessInfo}
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenOrder={handleOpenOrder}
        onOpenAdmin={() => handleNavigate('admin')}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {currentView === 'home' && (
          <>
            {/* Hero with real storefront backdrop & Opel vehicle open bonnet slider */}
            <Hero
              slides={heroSlides}
              businessInfo={businessInfo}
              homepageContent={homepageContent}
              onExploreEngines={() => {
                setSelectedCategory('engines');
                const element = document.getElementById('engines-registry');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                } else {
                  handleNavigate('catalogue', 'Engines');
                }
              }}
              onPlaceOrder={() => handleOpenOrder()}
            />

            {/* Featured Engines Spotlight */}
            <FeaturedSpotlight
              products={products}
              title={homepageContent.featuredTitle}
              subtitle={homepageContent.featuredSubtitle}
              onOpenOrder={handleOpenOrder}
              onOpenDetails={setSelectedProductDetails}
            />

            {/* Master Inventory Catalogue */}
            <ProductCatalogue
              products={products}
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              title={homepageContent.catalogueTitle}
              subtitle={homepageContent.catalogueSubtitle}
              onOpenOrder={handleOpenOrder}
              onOpenDetails={setSelectedProductDetails}
            />

            {/* Real Physical Shop Verification & Credentials */}
            <AboutSection 
              businessInfo={businessInfo}
              headline={homepageContent.aboutHeadline}
              description={homepageContent.aboutDescription}
              homepageContent={homepageContent}
            />

            {/* How To Order Process */}
            <HowToOrderSection
              onExploreEngines={() => {
                const element = document.getElementById('engines-registry');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              onOpenOrder={() => handleOpenOrder()}
            />

            {/* Call To Action Strip */}
            <CallToActionStrip
              businessInfo={businessInfo}
              headline={homepageContent.ctaHeadline}
              description={homepageContent.ctaDescription}
              onOpenOrder={() => handleOpenOrder()}
            />
          </>
        )}

        {currentView === 'catalogue' && (
          <div className="py-8">
            <ProductCatalogue
              products={products}
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              title={homepageContent.catalogueTitle}
              subtitle={homepageContent.catalogueSubtitle}
              onOpenOrder={handleOpenOrder}
              onOpenDetails={setSelectedProductDetails}
            />
            <CallToActionStrip
              businessInfo={businessInfo}
              headline={homepageContent.ctaHeadline}
              description={homepageContent.ctaDescription}
              onOpenOrder={() => handleOpenOrder()}
            />
          </div>
        )}

        {currentView === 'about' && (
          <div className="py-8 space-y-12">
            <AboutSection 
              businessInfo={businessInfo}
              headline={homepageContent.aboutHeadline}
              description={homepageContent.aboutDescription}
              homepageContent={homepageContent}
            />
            <ContactView
              businessInfo={businessInfo}
              onOpenOrder={() => handleOpenOrder()}
            />
            <CallToActionStrip
              businessInfo={businessInfo}
              headline={homepageContent.ctaHeadline}
              description={homepageContent.ctaDescription}
              onOpenOrder={() => handleOpenOrder()}
            />
          </div>
        )}

        {currentView === 'how-to-order' && (
          <div className="py-8 space-y-12">
            <HowToOrderSection
              onExploreEngines={() => handleNavigate('catalogue', 'Engines')}
              onOpenOrder={() => handleOpenOrder()}
            />
            <CallToActionStrip
              businessInfo={businessInfo}
              headline={homepageContent.ctaHeadline}
              description={homepageContent.ctaDescription}
              onOpenOrder={() => handleOpenOrder()}
            />
          </div>
        )}

        {currentView === 'contact' && (
          <div className="py-8 space-y-12">
            <ContactView
              businessInfo={businessInfo}
              onOpenOrder={() => handleOpenOrder()}
            />
            <CallToActionStrip
              businessInfo={businessInfo}
              headline={homepageContent.ctaHeadline}
              description={homepageContent.ctaDescription}
              onOpenOrder={() => handleOpenOrder()}
            />
          </div>
        )}
      </main>

      {/* Global Modals */}
      {/* 1. Product Details Modal */}
      <ProductDetailModal
        product={selectedProductDetails}
        businessInfo={businessInfo}
        onClose={() => setSelectedProductDetails(null)}
        onOpenOrder={handleOpenOrder}
      />

      {/* Discreet Developer / Administrator Access Button (bottom-left) */}
      <div className="fixed bottom-4 left-4 z-40">
        <button
          onClick={() => handleNavigate('admin')}
          className="bg-[#0d1222]/90 hover:bg-[#13192f] text-slate-400 hover:text-[#d4ff32] border border-[#273153] hover:border-[#d4ff32]/60 px-3 py-1.5 rounded-full text-[11px] font-mono shadow-xl backdrop-blur flex items-center gap-1.5 transition-all cursor-pointer group"
          title="Open Admin Dashboard (/admin)"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#d4ff32] group-hover:rotate-12 transition-transform" />
          <span>Admin Dashboard (/admin)</span>
        </button>
      </div>

      {/* Footer */}
      <Footer
        businessInfo={businessInfo}
        onNavigate={handleNavigate}
        onOpenAdmin={() => handleNavigate('admin')}
      />
    </div>
  );
}
