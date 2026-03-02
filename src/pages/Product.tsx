import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Check, Truck, ShieldCheck } from 'lucide-react';
import { products } from '../data/products';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';
import { FAQ } from '../components/FAQ';

export function Product() {
  const { id } = useParams();
  const { addToCart } = useStore();

  const product = products.find(p => p.id === Number(id));

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

  return (
    <main className="pb-20">
      <Link to="/" className="inline-flex items-center gap-2 text-[var(--color-rojo)]/70 hover:text-[var(--color-rojo)] transition-colors mb-8 group">
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium text-lg">Back to Store</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Product Image */}
        <div className="relative aspect-[4/5] lg:aspect-square bg-transparent rounded-3xl border border-[#C11B17] overflow-hidden flex items-center justify-center p-8">
          <motion.img
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            src={product.image}
            alt={product.title}
            style={product.imageFilter ? { filter: product.imageFilter } : undefined}
            className="w-full h-full object-contain drop-shadow-2xl"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col justify-center">
          <div className="mb-2 flex items-center gap-3">
            <span className="text-[var(--color-rojo)]/60 font-medium uppercase tracking-wider text-sm">{product.category}</span>
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-rojo)]/30"></div>
            <span className="text-[var(--color-rojo)]/60 font-medium uppercase tracking-wider text-sm">In Stock</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--color-rojo)] leading-tight mb-4 tracking-tight">
            {product.title}
          </h1>

          <div className="text-2xl md:text-3xl font-medium text-[var(--color-rojo)] mb-8">
            {product.price}
          </div>

          <p className="text-lg md:text-xl text-[var(--color-rojo)]/80 leading-relaxed mb-10">
            {product.description}
          </p>

          <div className="space-y-4 mb-10">
            <div className="flex items-center gap-3 text-[var(--color-rojo)]/80">
              <Check size={20} className="text-[#C11B17]" />
              <span className="text-lg">One size fits all (adults & teens)</span>
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

          <button
            onClick={() => addToCart(product.id)}
            className="w-full py-5 bg-[var(--color-rojo)] text-[var(--color-crema)] rounded-full font-bold text-xl hover:bg-[var(--color-rojo)]/90 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-xl shadow-[var(--color-rojo)]/20"
          >
            Add to Cart
          </button>

          <div className="grid grid-cols-2 gap-6 mt-10 pt-10 border-t border-[var(--color-rojo)]/10">
            <div className="flex flex-col gap-2">
              <Truck size={24} className="text-[var(--color-rojo)]/60" />
              <h4 className="font-medium text-[var(--color-rojo)]">Free Shipping</h4>
              <p className="text-sm text-[var(--color-rojo)]/60">All over India</p>
            </div>
            <div className="flex flex-col gap-2">
              <ShieldCheck size={24} className="text-[var(--color-rojo)]/60" />
              <h4 className="font-medium text-[var(--color-rojo)]">30-Day Returns</h4>
              <p className="text-sm text-[var(--color-rojo)]/60">Not cozee enough? Return it easily.</p>
            </div>
          </div>
        </div>
      </div>

      <FAQ />
    </main>
  );
}
