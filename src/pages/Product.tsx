import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Truck, ShieldCheck, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { products } from '../data/products';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { FAQ } from '../components/FAQ';
import { SizeGuide } from '../components/SizeGuide';
import { ProductReviews } from '../components/ProductReviews';
import { useState, useMemo, useRef, useEffect } from 'react';
import { useSEO } from '../hooks/useSEO';

export function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useStore();
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const buyButtonsRef = useRef<HTMLDivElement>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);

  const product = products.find(p => p.id === Number(id));

  // Extract color name from product title (e.g., "Cozee™ Original - Navy" -> "Navy Blue")
  const colorName = product?.title.split(' - ')[1] || '';

  const productSchema = useMemo(() => {
    if (!product) return undefined;
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.title,
      image: `https://thecozee.in${product.image}`,
      description: product.description,
      brand: { '@type': 'Brand', name: 'Cozee' },
      offers: {
        '@type': 'Offer',
        price: '2199',
        priceCurrency: 'INR',
        availability: 'https://schema.org/InStock',
        url: `https://thecozee.in/product/${product.id}`,
        seller: { '@type': 'Organization', name: 'Cozee' },
      },
    };
  }, [product]);

  useSEO({
    title: product
      ? `${product.title} – Wearable Blanket Hoodie | ₹2,199 – Cozee™`
      : 'Product Not Found – Cozee™',
    description: product
      ? `The ${product.title}. Ultra-soft sherpa fleece wearable blanket hoodie in ${colorName}. Oversized, unisex, perfect for winter nights. Order now – ₹2,199.`
      : 'This product could not be found.',
    canonical: product ? `https://thecozee.in/product/${product.id}` : undefined,
    ogImage: product ? `https://thecozee.in${product.image}` : undefined,
    ogType: 'product',
    jsonLd: productSchema,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show sticky bar if we scroll past the buttons (bounding rect is above viewport)
        if (!entry.isIntersecting && entry.boundingClientRect.y < 0) {
          setShowStickyBar(true);
        } else {
          setShowStickyBar(false);
        }
      },
      { threshold: 0 }
    );

    if (buyButtonsRef.current) {
      observer.observe(buyButtonsRef.current);
    }

    return () => observer.disconnect();
  }, [id]);

  const handleBuyNow = () => {
    if (product) {
      addToCart(product.id);
      navigate('/checkout');
    }
  };

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold text-[var(--color-rojo)] mb-4">Product Not Found</h1>
        <p className="text-xl text-[var(--color-rojo)]/70 mb-8">We couldn't find the Cozee you were looking for.</p>
        <Link to="/" className="px-8 py-3 bg-[var(--color-rojo)] text-[var(--color-crema)] rounded-full font-medium hover:bg-[var(--color-rojo)]/90 transition-colors">
          Back to Store
        </Link>
      </div>
    );
  }

  const allImages = (product as any).images ? (product as any).images : [product.image];

  return (
    <main className="pb-20">
      <Link to="/" className="inline-flex items-center gap-2 text-[var(--color-rojo)]/70 hover:text-[var(--color-rojo)] transition-colors mb-8 group">
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium text-lg">Back to Store</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        {/* Product Image Gallery */}
        <div className="relative aspect-square bg-transparent overflow-hidden flex items-center justify-center rounded-3xl border border-[var(--color-rojo)]/5">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImageIndex}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
              src={allImages[currentImageIndex]}
              alt={product.title}
              className="w-full h-full drop-shadow-2xl mix-blend-multiply object-contain p-4"
              referrerPolicy="no-referrer"
            />
          </AnimatePresence>

          {allImages.length > 1 && (
            <>
              {/* Left Arrow */}
              <button
                onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 border border-[var(--color-rojo)]/10 flex items-center justify-center text-[var(--color-rojo)] hover:bg-white transition-colors shadow-md cursor-pointer"
              >
                <ChevronLeft size={20} />
              </button>
              {/* Right Arrow */}
              <button
                onClick={() => setCurrentImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 border border-[var(--color-rojo)]/10 flex items-center justify-center text-[var(--color-rojo)] hover:bg-white transition-colors shadow-md cursor-pointer"
              >
                <ChevronRight size={20} />
              </button>
              {/* Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {allImages.map((_: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImageIndex(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${i === currentImageIndex ? 'bg-[var(--color-rojo)] scale-110' : 'bg-[var(--color-rojo)]/25 hover:bg-[var(--color-rojo)]/50'
                      }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Product Details */}
        <div className="flex flex-col justify-center">
          <div className="mb-2 flex items-center gap-3">
            <span className="text-[var(--color-rojo)]/60 font-medium uppercase tracking-wider text-sm">{product.category}</span>
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-rojo)]/30"></div>
            <span className="text-[var(--color-rojo)]/60 font-medium uppercase tracking-wider text-sm">In Stock</span>
          </div>

          <div className="flex flex-col mb-4 gap-1">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[var(--color-rojo)] leading-none tracking-tight">
              {colorName}
            </h1>
            <h2 className="text-2xl md:text-3xl font-light text-[var(--color-rojo)] leading-tight">
              Cozee™ Original
            </h2>
          </div>

          <div className="flex items-center gap-2 mb-6 cursor-pointer group" onClick={() => {
            document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' });
          }}>
            <div className="flex text-[var(--color-rojo)]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill="currentColor" strokeWidth={1} className="text-[#C11B17] mr-0.5" />
              ))}
            </div>
            <span className="text-[var(--color-rojo)]/80 font-medium text-sm border-b border-transparent group-hover:border-[var(--color-rojo)]/30 transition-colors">
              4.9/5 (248 reviews) <span className="mx-1">•</span> <span className="italic">Write a review</span>
            </span>
          </div>

          <div className="flex items-baseline gap-4 mb-8 mt-2">
            <span className="text-4xl md:text-5xl font-extrabold text-[var(--color-rojo)] tracking-tight">
              {product.price}
            </span>
            {product.originalPrice && (
              <span className="text-xl md:text-2xl line-through opacity-40 font-normal text-[var(--color-rojo)]">
                {product.originalPrice}
              </span>
            )}
          </div>

          <p className="text-lg md:text-xl text-[var(--color-rojo)]/80 leading-relaxed mb-10">
            {product.description}
          </p>

          <div className="space-y-4 mb-10">
            <div className="flex items-center gap-3 text-[var(--color-rojo)]/80">
              <Check size={20} className="text-[#C11B17]" />
              <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
                <span className="text-lg">One size fits all (adults & teens)</span>
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="text-sm font-black uppercase tracking-widest text-[var(--color-rojo)] border-b-2 border-[var(--color-rojo)]/30 hover:border-[var(--color-rojo)] transition-all cursor-pointer w-fit md:ml-2 italic"
                >
                  Size Guide
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3 text-[var(--color-rojo)]/80">
              <Check size={20} className="text-[#C11B17]" />
              <span className="text-lg">Machine washable & easy care</span>
            </div>
            <div className="flex items-center gap-3 text-[var(--color-rojo)]/80">
              <Check size={20} className="text-[#C11B17]" />
              <span className="text-lg">Cruelty-free vegan sherpa fleece</span>
            </div>
          </div>

          {/* Material Section */}
          <div className="mb-10 pt-8 border-t border-[var(--color-rojo)]/10">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[var(--color-rojo)]/50 mb-4">Material</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[var(--color-rojo)]/5 rounded-2xl p-4">
                <span className="block text-xs font-bold uppercase tracking-widest text-[var(--color-rojo)]/40 mb-1">Inner Lining</span>
                <span className="text-lg font-semibold text-[var(--color-rojo)]">Sherpa Fleece</span>
              </div>
              <div className="bg-[var(--color-rojo)]/5 rounded-2xl p-4">
                <span className="block text-xs font-bold uppercase tracking-widest text-[var(--color-rojo)]/40 mb-1">Outer Lining</span>
                <span className="text-lg font-semibold text-[var(--color-rojo)]">Flannel Fleece</span>
              </div>
            </div>
          </div>

          <div ref={buyButtonsRef} className="flex flex-col gap-4">
            <button
              onClick={() => addToCart(product.id)}
              className="w-full py-5 border-2 border-[var(--color-rojo)] text-[var(--color-rojo)] rounded-full font-bold text-xl hover:bg-[var(--color-rojo)]/5 transition-all cursor-pointer"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="w-full py-5 bg-[var(--color-rojo)] text-[var(--color-crema)] rounded-full font-bold text-xl hover:bg-[var(--color-rojo)]/90 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-xl shadow-[var(--color-rojo)]/20"
            >
              Buy Now
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-10 pt-10 border-t border-[var(--color-rojo)]/10">
            <div className="flex flex-col gap-2">
              <Truck size={24} className="text-[var(--color-rojo)]/60" />
              <h4 className="font-medium text-[var(--color-rojo)]">Free Shipping</h4>
              <p className="text-sm text-[var(--color-rojo)]/60">All over India</p>
            </div>
            <div className="flex flex-col gap-2">
              <ShieldCheck size={24} className="text-[var(--color-rojo)]/60" />
              <h4 className="font-medium text-[var(--color-rojo)]">7-Day Returns</h4>
              <p className="text-sm text-[var(--color-rojo)]/60">Not cozee enough? Return it easily.</p>
            </div>
          </div>
        </div>
      </div>

      <div id="reviews-section">
        <ProductReviews />
      </div>

      <FAQ />

      <SizeGuide isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />

      {/* Mobile Sticky Buy Bar */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 p-4 bg-[var(--color-crema)] border-t border-[var(--color-rojo)]/10 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-50 md:hidden flex items-center justify-between gap-4"
          >
            <div className="flex flex-col flex-1 min-w-0">
              <span className="font-bold text-[var(--color-rojo)] truncate text-sm">{product.title}</span>
              <span className="font-bold text-[var(--color-rojo)]/80 text-sm">{product.price}</span>
            </div>
            <button
              onClick={handleBuyNow}
              className="px-6 py-3 bg-[var(--color-rojo)] text-[var(--color-crema)] rounded-full font-bold text-sm hover:bg-[var(--color-rojo)]/90 active:scale-[0.98] transition-all cursor-pointer shadow-lg whitespace-nowrap"
            >
              Buy Now
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
