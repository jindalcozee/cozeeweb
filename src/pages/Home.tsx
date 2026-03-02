import { useState } from 'react';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Hero3D } from '../components/Hero3D';
import { FAQ } from '../components/FAQ';
import { products, categories } from '../data/products';

export function Home() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main>
      <h1 className="text-[20vw] md:text-[14vw] font-bold leading-none mb-8 md:mb-16 tracking-tighter ml-[-0.05em]">Store</h1>

      <Hero3D />

      {/* Filters & Search */}
      <div className="flex justify-between items-center border-b border-[var(--color-rojo)]/20 pb-4 mb-4">
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="text-lg md:text-xl font-medium hover:opacity-70 transition-opacity cursor-pointer flex items-center gap-2"
        >
          Filters {showFilters ? '-' : '+'}
        </button>
        <div className="flex items-center gap-3 text-[var(--color-rojo)]/50 focus-within:text-[var(--color-rojo)] transition-colors">
          <Search size={20} />
          <input 
            type="text" 
            placeholder="Search" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none placeholder:text-[var(--color-rojo)]/50 text-[var(--color-rojo)] w-24 focus:w-48 md:w-32 md:focus:w-64 transition-all text-lg md:text-xl"
          />
        </div>
      </div>

      {/* Categories Panel */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showFilters ? 'max-h-40 opacity-100 mb-8 md:mb-12' : 'max-h-0 opacity-0 mb-4 md:mb-8'}`}>
        <div className="flex flex-wrap gap-3 pt-2">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-base md:text-lg px-5 py-2 rounded-full border border-[var(--color-rojo)] transition-colors cursor-pointer ${
                activeCategory === cat 
                  ? 'bg-[var(--color-rojo)] text-[var(--color-crema)]' 
                  : 'hover:bg-[var(--color-rojo)]/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-12 md:gap-y-16">
        {filteredProducts.map((product) => (
          <Link to={`/product/${product.id}`} key={product.id} className="group cursor-pointer flex flex-col">
            <div 
              className="aspect-[4/5] overflow-hidden mb-4 rounded-3xl relative border border-[#C11B17]"
              style={{ backgroundColor: product.bgColor || 'rgba(189, 32, 37, 0.05)' }}
            >
              <img 
                src={product.image} 
                alt={product.title}
                className={`w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out mix-blend-multiply ${product.contain ? 'object-contain p-4' : 'object-cover'}`}
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex justify-between items-center text-lg md:text-xl font-medium">
              <span>{product.title}</span>
              {product.price && (
                <div className="flex items-center gap-3">
                  <span>{product.price}</span>
                  <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-rojo)]/20"></div>
                </div>
              )}
            </div>
            <div className="text-sm md:text-base opacity-60 mt-1">{product.category}</div>
          </Link>
        ))}
        
        {filteredProducts.length === 0 && (
          <div className="col-span-1 md:col-span-2 py-20 text-center text-xl opacity-60">
            No products found matching your criteria.
          </div>
        )}
      </div>

      {/* About Us Section */}
      <section className="mt-32 mb-16 border-t border-[var(--color-rojo)]/20 pt-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
          <div>
            <h2 className="text-4xl md:text-6xl font-medium mb-8 leading-tight">
              Premium Winter Wear,<br />
              <span className="italic opacity-70">Exclusively Yours.</span>
            </h2>
            <p className="text-lg md:text-xl opacity-80 leading-relaxed mb-6">
              At Cozee™, we believe that winter wear shouldn't just keep you warm—it should be an experience. Our premium line of oversized wearables is crafted from the highest-grade sherpa fleece and ultra-soft flannel, ensuring unparalleled comfort during the coldest months.
            </p>
            <p className="text-lg md:text-xl opacity-80 leading-relaxed">
              Every piece in our collection is an exclusive, limited-run design. We meticulously craft each Cozee to be the ultimate companion for your cozee nights in. Experience the luxury of true warmth.
            </p>
            <button className="mt-10 border-b-2 border-[var(--color-rojo)] pb-1 text-xl font-medium hover:opacity-70 transition-opacity flex items-center gap-2 group cursor-pointer">
              Discover Our Story 
              <span className="transform transition-transform group-hover:translate-x-2">→</span>
            </button>
          </div>
          <div className="relative aspect-[4/5] bg-[#FDF5E6] rounded-3xl overflow-hidden group">
            <img 
              src="/cozeeab.png.png"
              alt="Premium Winter Wear"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 border border-[var(--color-rojo)]/10 m-4 rounded-3xl pointer-events-none"></div>
          </div>
        </div>
      </section>

      <FAQ />
    </main>
  );
}
