import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { supabase } from '../lib/supabase';
import { User } from 'lucide-react';

export function Header() {
  const { toggleCart, toggleMenu, cart } = useStore();
  const [user, setUser] = useState<any>(null);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    // Listen for auth changes
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="glass-header flex justify-between items-center -mx-4 md:-mx-8 px-4 md:px-8 py-4 mb-12 md:mb-20 rounded-b-2xl transition-all duration-300">
      <div className="flex items-center gap-4 md:gap-8">
        <button
          onClick={toggleMenu}
          className="text-lg md:text-xl font-medium hover:opacity-70 transition-opacity cursor-pointer"
        >
          Menu
        </button>
        <Link
          to={user ? "/account" : "/login"}
          className="text-[var(--color-rojo)] hover:opacity-70 transition-opacity"
          title={user ? "Account" : "Login"}
        >
          <User size={24} strokeWidth={2.5} />
        </Link>
      </div>

      <Link to="/" className="text-[var(--color-rojo)] flex items-center justify-center -ml-12 md:-ml-20 transition-transform hover:scale-105">
        <span className="text-3xl md:text-5xl font-black tracking-tighter font-logo text-center">COZEE</span>
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
