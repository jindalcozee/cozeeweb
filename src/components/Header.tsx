import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';

export function Header() {
  const { toggleCart, toggleMenu, cart } = useStore();
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="flex justify-between items-center mb-12 md:mb-20 pt-2">
      <button 
        onClick={toggleMenu} 
        className="text-lg md:text-xl font-medium hover:opacity-70 transition-opacity cursor-pointer"
      >
        Menu
      </button>
      <Link to="/" className="text-[var(--color-rojo)] flex items-center justify-center">
        <span className="text-3xl md:text-4xl font-black tracking-tighter font-logo">COZEE</span>
      </Link>
      <button 
        onClick={toggleCart} 
        className="text-lg md:text-xl font-medium hover:opacity-70 transition-opacity cursor-pointer"
      >
        Cart ({cartCount})
      </button>
    </header>
  );
}
