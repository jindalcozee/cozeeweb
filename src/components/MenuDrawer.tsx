import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';

export function MenuDrawer() {
  const { isMenuOpen, toggleMenu } = useStore();

  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'Shop All', path: '/' },
    { label: 'Originals', path: '/' },
    { label: 'About Us', path: '/' },
    { label: 'Contact', path: '/' },
  ];

  return (
    <AnimatePresence>
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleMenu}
            className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 h-full w-full md:w-[400px] bg-[#FDF5E6] z-50 shadow-2xl flex flex-col border-r border-[var(--color-rojo)]/20"
          >
            <div className="flex justify-between items-center p-6 border-b border-[var(--color-rojo)]/10">
              <span className="text-3xl font-black tracking-tighter font-logo text-[var(--color-rojo)]">COZEE</span>
              <button onClick={toggleMenu} className="p-2 hover:bg-[var(--color-rojo)]/10 rounded-full transition-colors text-[var(--color-rojo)] cursor-pointer">
                <X size={24} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-8 flex flex-col gap-6">
              {menuItems.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link 
                    to={item.path} 
                    onClick={toggleMenu}
                    className="text-4xl md:text-5xl font-bold text-[var(--color-rojo)] hover:opacity-60 transition-opacity tracking-tight"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="p-8 border-t border-[var(--color-rojo)]/10 bg-white/30 text-[var(--color-rojo)]/60 text-sm">
              <p>© 2026 Cozee™. All rights reserved.</p>
              <div className="flex gap-4 mt-4">
                <a href="#" className="hover:text-[var(--color-rojo)] transition-colors">Instagram</a>
                <a href="#" className="hover:text-[var(--color-rojo)] transition-colors">TikTok</a>
                <a href="#" className="hover:text-[var(--color-rojo)] transition-colors">Twitter</a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
