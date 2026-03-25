import { useState, useEffect, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import { Hero3D } from '../components/Hero3D';
import { FAQ } from '../components/FAQ';
import { ScrollReveal } from '../components/ScrollReveal';
import { Testimonials } from '../components/Testimonials';
import { products, categories } from '../data/products';
import { useSEO } from '../hooks/useSEO';

export function Home() {
  const faqSchema = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is a wearable blanket hoodie?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A wearable blanket hoodie is an oversized, ultra-warm hoodie made from sherpa fleece that you can wear like a blanket. Perfect for lounging, WFH, and cozy winter nights.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is Cozee™ unisex?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! Cozee™ hoodies are designed to fit everyone — men, women, and teens. One size fits all.',
        },
      },
      {
        '@type': 'Question',
        name: 'What material is Cozee™ made of?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Cozee™ is crafted from premium sherpa fleece on the inside and ultra-soft flannel on the outside for maximum warmth and comfort.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do you offer free shipping?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, we offer free shipping across India on all orders.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I wash my Cozee™?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Machine wash cold, tumble dry low. Do not bleach or iron.',
        },
      },
    ],
  }), []);

  useSEO({
    title: "Cozee™ – Premium Winterwear | India's Coziest Wearable Blanket Hoodie",
    description: "Wrap yourself in warmth with Cozee™ — India's Premium Winterwear and the ultimate wearable blanket hoodie. Ultra-soft sherpa fleece, oversized comfort. Starting at ₹2,199. Free shipping across India.",
    canonical: 'https://thecozee.in/',
    jsonLd: faqSchema,
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const { hash } = useLocation();

  const initialCategory = searchParams.get('category') || 'All';
  const [activeCategory, setActiveCategory] = useState(initialCategory);

  // Sync URL changes to the active category
  useEffect(() => {
    const categoryQuery = searchParams.get('category');
    if (categoryQuery) {
      setActiveCategory(categoryQuery);
    }
  }, [searchParams]);

  // Handle smooth scrolling when hash is present
  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        // slight delay to ensure render is complete
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [hash]);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setSearchParams({ category: cat });
  };

  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main>
      <ScrollReveal width="100%">
        <h1 className="text-[10vw] md:text-[6.5vw] font-bold leading-none mb-8 md:mb-16 tracking-tighter text-center">Stay Warm, Stay Cozee.</h1>
      </ScrollReveal>

      <ScrollReveal width="100%" delay={0.4}>
        <Hero3D />
      </ScrollReveal>

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
              onClick={() => handleCategoryChange(cat)}
              className={`text-base md:text-lg px-5 py-2 rounded-full border border-[var(--color-rojo)] transition-colors cursor-pointer ${activeCategory === cat
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
      <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:gap-y-16">
        {filteredProducts.map((product, idx) => (
          <ScrollReveal key={product.id} width="100%" delay={idx % 4 * 0.1}>
            <Link to={`/product/${product.id}`} className="group cursor-pointer flex flex-col transform transition-all duration-500 hover:-translate-y-2">
              <div
                className="aspect-square overflow-hidden mb-4 rounded-3xl relative bg-transparent group-hover:shadow-2xl transition-shadow duration-500"
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out mix-blend-multiply object-contain p-4"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xl md:text-3xl font-extrabold text-[var(--color-rojo)] leading-tight">
                  {product.title.split(' - ')[1] || product.title}
                </span>
                <span className="text-base md:text-lg font-light text-[var(--color-rojo)] mt-0.5">
                  Cozee™ Original
                </span>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xl md:text-2xl font-extrabold text-[var(--color-rojo)]">{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-sm md:text-base line-through opacity-40 font-normal">{product.originalPrice}</span>
                  )}
                </div>
              </div>
            </Link>
          </ScrollReveal>
        ))}

        {filteredProducts.length === 0 && (
          <div className="col-span-2 py-20 text-center text-xl opacity-60">
            No products found matching your criteria.
          </div>
        )}
      </div>

      {/* About Us Section */}
      <section id="about" className="mt-32 mb-16 border-t border-[var(--color-rojo)]/20 pt-24">
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
          <div className="relative aspect-[3/4] bg-[#FDF5E6] rounded-3xl overflow-hidden group">
            <img
              src="/about-cozee.jpg"
              alt="Premium Winter Wear"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 border border-[var(--color-rojo)]/10 m-4 rounded-3xl pointer-events-none"></div>
          </div>
        </div>
      </section>

      <div id="faq">
        <ScrollReveal width="100%">
          <FAQ />
        </ScrollReveal>
      </div>

      <Testimonials />
    </main>
  );
}
