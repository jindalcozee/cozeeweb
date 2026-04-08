import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { useStore } from '../store/useStore';

export function CartDrawer() {
  const { isCartOpen, toggleCart, cart, updateQuantity, removeFromCart, checkoutUrl, isLoading } = useStore();

  const subtotal = cart.reduce((acc, item) => {
    // Assuming price is passed as a string like "2199" or number
    const priceNum = typeof item.price === 'string' ? parseFloat(item.price.replace(/[^\d.-]/g, '')) : (item.price || 0);
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

            <div className="flex-1 overflow-y-auto p-6 space-y-6 relative">
              {isLoading && (
                <div className="absolute inset-0 bg-white/20 backdrop-blur-sm z-10 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-[var(--color-rojo)]/30 border-t-[var(--color-rojo)] rounded-full animate-spin" />
                </div>
              )}

              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-[var(--color-rojo)]/50 space-y-4">
                  <p className="text-xl font-medium">Your cart is empty</p>
                  <button onClick={toggleCart} className="text-[var(--color-rojo)] border-b border-[var(--color-rojo)] pb-1 hover:opacity-70 transition-opacity cursor-pointer">
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.lineId || item.productId} className="flex gap-4 bg-white/50 p-4 rounded-2xl border border-[var(--color-rojo)]/10">
                    <div className="w-20 h-20 bg-transparent rounded-xl border border-[#C11B17] overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.title} className="w-full h-full object-contain mix-blend-multiply p-1" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-[var(--color-rojo)] leading-tight">{item.title}</h3>
                        <button onClick={() => item.lineId && removeFromCart(item.lineId)} className="text-[var(--color-rojo)]/40 hover:text-[var(--color-rojo)] transition-colors cursor-pointer">
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <div className="text-[var(--color-rojo)]/80 font-medium">INR {item.price}</div>
                      
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center border border-[var(--color-rojo)]/20 rounded-full overflow-hidden">
                          <button onClick={() => item.lineId && updateQuantity(item.lineId, item.quantity - 1)} className="px-3 py-1 hover:bg-[var(--color-rojo)]/10 text-[var(--color-rojo)] transition-colors cursor-pointer">
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-sm font-medium text-[var(--color-rojo)]">{item.quantity}</span>
                          <button onClick={() => item.lineId && updateQuantity(item.lineId, item.quantity + 1)} className="px-3 py-1 hover:bg-[var(--color-rojo)]/10 text-[var(--color-rojo)] transition-colors cursor-pointer">
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-[var(--color-rojo)]/10 bg-white/30">
                <div className="flex justify-between items-center mb-6 text-xl font-bold text-[var(--color-rojo)]">
                  <span>Subtotal</span>
                  <span>{subtotal.toLocaleString()} INR</span>
                </div>
                <button 
                  onClick={() => {
                    if (checkoutUrl) {
                      window.location.href = checkoutUrl;
                    }
                  }}
                  disabled={!checkoutUrl || isLoading}
                  className="w-full py-4 bg-[var(--color-rojo)] text-[var(--color-crema)] rounded-full font-medium text-lg hover:bg-[var(--color-rojo)]/90 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {checkoutUrl ? 'Secure Checkout' : 'Preparing Checkout...'}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
