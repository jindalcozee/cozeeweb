import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { products } from '../data/products';

export function CartDrawer() {
  const navigate = useNavigate();
  const { isCartOpen, toggleCart, cart, updateQuantity, removeFromCart } = useStore();

  const cartItems = cart.map(item => ({
    ...item,
    product: products.find(p => p.id === item.productId)!
  })).filter(item => item.product);

  const subtotal = cartItems.reduce((acc, item) => {
    const priceNum = parseInt(item.product.price.replace(/\D/g, ''));
    return acc + (priceNum * item.quantity);
  }, 0);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-[#FDF5E6] z-50 shadow-2xl flex flex-col border-l border-[var(--color-rojo)]/20"
          >
            <div className="flex justify-between items-center p-6 border-b border-[var(--color-rojo)]/10">
              <h2 className="text-3xl font-bold tracking-tight text-[var(--color-rojo)]">Your Cart</h2>
              <button onClick={toggleCart} className="p-2 hover:bg-[var(--color-rojo)]/10 rounded-full transition-colors text-[var(--color-rojo)] cursor-pointer">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-[var(--color-rojo)]/50 space-y-4">
                  <p className="text-xl font-medium">Your cart is empty</p>
                  <button onClick={toggleCart} className="text-[var(--color-rojo)] border-b border-[var(--color-rojo)] pb-1 hover:opacity-70 transition-opacity cursor-pointer">
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.productId} className="flex gap-4 bg-white/50 p-4 rounded-2xl border border-[var(--color-rojo)]/10">
                    <div className="w-24 h-24 bg-[#FFF5EB] rounded-xl border border-[#C11B17] overflow-hidden flex-shrink-0">
                      <img src={item.product.image} alt={item.product.title} className="w-full h-full object-contain p-2 mix-blend-multiply" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-[var(--color-rojo)] leading-tight">{item.product.title}</h3>
                        <button onClick={() => removeFromCart(item.productId)} className="text-[var(--color-rojo)]/40 hover:text-[var(--color-rojo)] transition-colors cursor-pointer">
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <div className="text-[var(--color-rojo)]/80 font-medium">{item.product.price}</div>
                      
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center border border-[var(--color-rojo)]/20 rounded-full overflow-hidden">
                          <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="px-3 py-1 hover:bg-[var(--color-rojo)]/10 text-[var(--color-rojo)] transition-colors cursor-pointer">
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-sm font-medium text-[var(--color-rojo)]">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="px-3 py-1 hover:bg-[var(--color-rojo)]/10 text-[var(--color-rojo)] transition-colors cursor-pointer">
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="p-6 border-t border-[var(--color-rojo)]/10 bg-white/30">
                <div className="flex justify-between items-center mb-6 text-xl font-bold text-[var(--color-rojo)]">
                  <span>Subtotal</span>
                  <span>{subtotal} INR</span>
                </div>
                <button 
                  onClick={() => {
                    toggleCart();
                    navigate('/checkout');
                  }}
                  className="w-full py-4 bg-[var(--color-rojo)] text-[var(--color-crema)] rounded-full font-medium text-lg hover:bg-[var(--color-rojo)]/90 transition-colors cursor-pointer"
                >
                  Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
