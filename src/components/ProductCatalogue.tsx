import React, { useState, useMemo } from 'react';
import { Layers, Search, ShoppingBag, Eye, X, Film } from 'lucide-react';
import { Product, Category, VideoSettings } from '../types';
import { MediaVideoPlayer } from './MediaVideoPlayer';
import { OptimizedImage } from './OptimizedImage';

interface ProductCatalogueProps {
  products: Product[];
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categorySlug: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onOpenOrder: (productName?: string) => void;
  onOpenDetails: (product: Product) => void;
  title?: string;
  subtitle?: string;
  video?: VideoSettings;
}

export const ProductCatalogue: React.FC<ProductCatalogueProps> = ({
  products,
  categories,
  selectedCategory,
  onSelectCategory,
  searchTerm,
  onSearchChange,
  onOpenOrder,
  onOpenDetails,
  title,
  subtitle,
  video
}) => {
  const [vehicleBrandFilter, setVehicleBrandFilter] = useState('ALL');
  const [availabilityFilter, setAvailabilityFilter] = useState('ALL');

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter
      if (selectedCategory !== 'all') {
        const catObj = categories.find(c => c.slug === selectedCategory);
        if (catObj && product.category.toLowerCase() !== catObj.name.toLowerCase()) {
          // Check if category matches
          if (selectedCategory === 'engines' && !product.category.toLowerCase().includes('engine')) {
            return false;
          }
          if (selectedCategory === 'engine-parts' && !product.category.toLowerCase().includes('part')) {
            return false;
          }
        }
      }

      // Search term
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(term);
        const matchesCat = product.category.toLowerCase().includes(term);
        const matchesFitment = product.fitment?.toLowerCase().includes(term) || false;
        const matchesDesc = product.description?.toLowerCase().includes(term) || false;
        if (!matchesName && !matchesCat && !matchesFitment && !matchesDesc) {
          return false;
        }
      }

      // Vehicle Brand filter
      if (vehicleBrandFilter !== 'ALL') {
        const fitment = (product.fitment || '') + ' ' + product.name;
        if (!fitment.toLowerCase().includes(vehicleBrandFilter.toLowerCase())) {
          return false;
        }
      }

      // Availability filter
      if (availabilityFilter !== 'ALL') {
        if (!product.availability.toLowerCase().includes(availabilityFilter.toLowerCase())) {
          return false;
        }
      }

      return true;
    });
  }, [products, selectedCategory, categories, searchTerm, vehicleBrandFilter, availabilityFilter]);

  return (
    <section className="py-16 bg-[#080b14]" id="engines-registry" data-purpose="inventory-registry">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Registry Headline */}
        <div className="space-y-2">
          <div className="tech-mono text-xs text-[#d4ff32] font-bold uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-3.5 h-3.5" /> MASTER INVENTORY REGISTRY
          </div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight font-heading">
            {title || 'EXPLORE OUR ENGINES & ENGINE PARTS'}
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            {subtitle || 'Complete assemblies, cylinder heads, crankcases, pistons, and precision mechanical spares catalogued directly from the Abossey Okai warehouse floor.'}
          </p>
        </div>

        {/* Optional Catalogue Video Showcase */}
        {video && video.enabled && (
          <div className="rounded-2xl overflow-hidden border border-[#273153] bg-[#13192f] p-3 sm:p-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 px-1 text-xs font-mono">
              <span className="text-[#d4ff32] font-bold uppercase flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5" />
                {video.title || 'INVENTORY VIDEO SPOTLIGHT'}
              </span>
              {video.duration && (
                <span className="text-slate-400 text-[11px] font-mono">{Math.round(video.duration)}s</span>
              )}
            </div>
            <div className="aspect-video max-h-[440px] w-full rounded-xl overflow-hidden bg-black">
              <MediaVideoPlayer video={video} className="w-full h-full" />
            </div>
          </div>
        )}

        {/* Search & Filters Container */}
        <div className="space-y-4">
          {/* Live Search Field */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by engine model, part name, or vehicle application (e.g. OPEL 1.6, ASTRA G, OPEL HEAD 2.0, CLOSE HEAD, CHEVROLET OPTRA)..."
              className="w-full pl-11 pr-10 py-3 bg-[#13192f] border border-[#273153] rounded-lg text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#d4ff32] transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Quick Badges */}
          <div className="flex flex-wrap items-center gap-2 tech-mono text-xs">
            <button
              onClick={() => onSelectCategory('all')}
              className={`px-4 py-2 rounded font-extrabold transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#d4ff32] text-[#080b14]'
                  : 'bg-[#13192f] hover:bg-[#18203d] text-slate-300 border border-[#273153]'
              }`}
            >
              ALL ({products.length})
            </button>
            <button
              onClick={() => onSelectCategory('engines')}
              className={`px-3.5 py-1.5 rounded transition-all cursor-pointer ${
                selectedCategory === 'engines'
                  ? 'bg-[#d4ff32] text-[#080b14] font-bold'
                  : 'bg-[#13192f] hover:bg-[#18203d] text-slate-300 border border-[#273153]'
              }`}
            >
              ENGINES ({products.filter(p => p.category === 'Engines').length})
            </button>
            <button
              onClick={() => onSelectCategory('engine-parts')}
              className={`px-3.5 py-1.5 rounded transition-all cursor-pointer ${
                selectedCategory === 'engine-parts'
                  ? 'bg-[#d4ff32] text-[#080b14] font-bold'
                  : 'bg-[#13192f] hover:bg-[#18203d] text-slate-300 border border-[#273153]'
              }`}
            >
              ENGINE PARTS ({products.filter(p => p.category === 'Engine Parts').length})
            </button>
          </div>

          {/* Dropdown Filtering Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 tech-mono text-xs">
            <div>
              <label className="block text-[10px] text-slate-400 uppercase mb-1 font-bold">VEHICLE BRAND / FITMENT</label>
              <select
                value={vehicleBrandFilter}
                onChange={(e) => setVehicleBrandFilter(e.target.value)}
                className="w-full bg-[#13192f] border border-[#273153] rounded p-2.5 text-slate-200 text-xs focus:border-[#d4ff32] focus:outline-none"
              >
                <option value="ALL">All Brands (Opel / GM / Chevrolet / Vauxhall)</option>
                <option value="Astra">Opel Astra</option>
                <option value="Vectra">Opel Vectra</option>
                <option value="Corsa">Opel Corsa</option>
                <option value="Zafira">Opel Zafira</option>
                <option value="Chevrolet">Chevrolet / GM</option>
                <option value="Agila">Opel Agila</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 uppercase mb-1 font-bold">LOCATION AVAILABILITY</label>
              <select
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
                className="w-full bg-[#13192f] border border-[#273153] rounded p-2.5 text-slate-200 text-xs focus:border-[#d4ff32] focus:outline-none"
              >
                <option value="ALL">All Stock Statuses</option>
                <option value="Shop Door E-3">Ready In-Shop (Shop Door E-3)</option>
                <option value="In Stock">In Stock</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {filteredProducts.map((product, idx) => (
              <div
                key={product.id}
                className="bg-[#13192f] hover:bg-[#18203d] rounded-xl border border-[#273153] hover:border-[#d4ff32]/40 overflow-hidden flex flex-col justify-between transition-all duration-300 group shadow-md"
                data-purpose="product-card"
              >
                <div className="p-4 space-y-3">
                  {/* Image container with stable aspect ratio */}
                  <div 
                    onClick={() => onOpenDetails(product)}
                    className="relative aspect-[4/3] rounded-lg overflow-hidden bg-black/40 border border-[#273153] cursor-pointer"
                  >
                    {product.images && product.images[0] ? (
                      <OptimizedImage
                        src={product.images[0]}
                        alt={product.name}
                        priority={idx < 3}
                        className="w-full h-full rounded-lg group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs font-mono">
                        No Image Available
                      </div>
                    )}
                    <span className="absolute top-2 left-2 bg-[#d4ff32] text-[#080b14] text-[10px] font-mono px-2 py-0.5 rounded font-extrabold uppercase">
                      {product.availability || 'IN STOCK • SHOP E-3'}
                    </span>
                    <span className="absolute bottom-2 right-2 bg-black/85 text-[#d4ff32] text-[10px] font-mono px-2 py-0.5 rounded border border-[#d4ff32]/30 font-bold">
                      {product.condition || 'TESTED'}
                    </span>
                  </div>

                  {/* Metadata & Title */}
                  <div className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
                    {product.category}
                  </div>
                  <h4 
                    onClick={() => onOpenDetails(product)}
                    className="text-base font-black text-white uppercase tracking-wide font-heading hover:text-[#d4ff32] transition-colors cursor-pointer"
                  >
                    {product.name}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {product.description || 'Genuine assembly with verified mounting points and engine components.'}
                  </p>

                  <div className="pt-2 border-t border-[#273153] font-mono text-[11px] grid grid-cols-2 gap-2 text-slate-300">
                    <div>
                      <span className="text-slate-500 font-bold">FITMENT:</span> {product.fitment || 'Opel / GM'}
                    </div>
                    <div>
                      <span className="text-slate-500 font-bold">LOCATION:</span> Shop Door E-3
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="p-3.5 bg-[#0d1222] border-t border-[#273153] flex gap-2">
                  <button
                    onClick={() => onOpenOrder(product.name)}
                    className="w-1/2 py-2 bg-[#d4ff32] hover:bg-[#c1ec25] text-[#080b14] text-center font-mono text-xs uppercase font-extrabold rounded transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>PLACE ORDER</span>
                  </button>
                  <button
                    onClick={() => onOpenDetails(product)}
                    className="w-1/2 py-2 bg-[#13192f] hover:bg-[#273153] text-white text-center font-mono text-xs uppercase rounded border border-white/10 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>DETAILS</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-[#13192f] rounded-xl border border-[#273153] overflow-hidden p-4 space-y-3">
                <div className="aspect-[4/3] rounded-lg bg-[#080b14] border border-[#273153]" />
                <div className="h-4 w-20 bg-[#080b14] rounded" />
                <div className="h-6 w-3/4 bg-[#080b14] rounded" />
                <div className="h-4 w-full bg-[#080b14] rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center bg-[#13192f] border border-[#273153] rounded-2xl p-8 space-y-4">
            <div className="text-slate-400 font-mono text-sm">
              No engine or part found matching "<span className="text-[#d4ff32]">{searchTerm}</span>"
            </div>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              If the specific part or engine code is not listed in our online index, please contact Joseph Obeng Anderson directly via phone.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => {
                  onSearchChange('');
                  setVehicleBrandFilter('ALL');
                  setAvailabilityFilter('ALL');
                  onSelectCategory('all');
                }}
                className="px-4 py-2 bg-[#0d1222] text-white hover:text-[#d4ff32] border border-[#273153] rounded text-xs font-mono"
              >
                Reset Filters
              </button>
              <button
                onClick={() => onOpenOrder(searchTerm ? `Custom Request: ${searchTerm}` : undefined)}
                className="px-4 py-2 bg-[#d4ff32] hover:bg-[#c1ec25] text-[#080b14] font-mono text-xs font-bold rounded flex items-center gap-1.5 cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>PLACE ORDER</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
