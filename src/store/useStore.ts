import { create } from 'zustand';

export type CartItem = {
  productId: number;
  quantity: number;
};

interface StoreState {
  isCartOpen: boolean;
  isMenuOpen: boolean;
  cart: CartItem[];
  toggleCart: () => void;
  toggleMenu: () => void;
  addToCart: (productId: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

export const useStore = create<StoreState>((set) => ({
  isCartOpen: false,
  isMenuOpen: false,
  cart: [],
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
  addToCart: (productId) => set((state) => {
    const existing = state.cart.find(item => item.productId === productId);
    if (existing) {
      return { 
        cart: state.cart.map(item => item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item),
        isCartOpen: true 
      };
    }
    return { 
      cart: [...state.cart, { productId, quantity: 1 }],
      isCartOpen: true 
    };
  }),
  removeFromCart: (productId) => set((state) => ({
    cart: state.cart.filter(item => item.productId !== productId)
  })),
  updateQuantity: (productId, quantity) => set((state) => ({
    cart: quantity <= 0
      ? state.cart.filter(item => item.productId !== productId)
      : state.cart.map(item => item.productId === productId ? { ...item, quantity } : item)
  })),
  clearCart: () => set({ cart: [] })
}));
