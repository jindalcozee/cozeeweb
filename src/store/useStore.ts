import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  shopifyFetch, 
  createCartMutation, 
  addToCartMutation, 
  updateCartMutation, 
  removeCartLineMutation 
} from '../lib/shopify';

export type CartItem = {
  productId: string; // Now a Shopify Variant ID
  quantity: number;
  lineId?: string; // Shopify Cart Line ID
  title?: string;
  image?: string;
  price?: string;
};

interface StoreState {
  isCartOpen: boolean;
  isMenuOpen: boolean;
  cart: CartItem[];
  cartId: string | null;
  checkoutUrl: string | null;
  isLoading: boolean;
  toggleCart: () => void;
  toggleMenu: () => void;
  addToCart: (variantId: string, productData?: any) => Promise<void>;
  removeFromCart: (lineId: string) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      isCartOpen: false,
      isMenuOpen: false,
      cart: [],
      cartId: null,
      checkoutUrl: null,
      isLoading: false,
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
      toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
      
      addToCart: async (variantId, productData) => {
        set({ isLoading: true });
        let { cartId, cart } = get();

        // Optimistic UI update
        const existing = cart.find((item) => item.productId === variantId);
        if (existing) {
          set({
            cart: cart.map((item) =>
              item.productId === variantId ? { ...item, quantity: item.quantity + 1 } : item
            ),
            isCartOpen: true
          });
        } else {
          set({
            cart: [...cart, { productId: variantId, quantity: 1, ...productData }],
            isCartOpen: true
          });
        }

        try {
          if (!cartId) {
            // Create a new cart
            const res = await shopifyFetch({
              query: createCartMutation,
              variables: {
                cartInput: {
                  lines: [{ merchandiseId: variantId, quantity: 1 }]
                }
              }
            });
            const newCart = res.body.data.cartCreate.cart;
            
            // Map the returned lines to our state so we have lineIds
            const updatedLines = newCart.lines.edges.map((edge: any) => ({
               productId: edge.node.merchandise.id,
               lineId: edge.node.id,
               quantity: edge.node.quantity,
               title: edge.node.merchandise.product.title,
            }));
            
            // Merge with local product data (like image) so we don't lose it
            const finalCart = updatedLines.map((line: any) => {
               const localMatch = get().cart.find(c => c.productId === line.productId);
               return { ...localMatch, ...line };
            });

            set({
              cartId: newCart.id,
              checkoutUrl: newCart.checkoutUrl,
              cart: finalCart,
              isLoading: false
            });
          } else {
            // Add to existing cart
            const res = await shopifyFetch({
              query: addToCartMutation,
              variables: {
                cartId: cartId,
                lines: [{ merchandiseId: variantId, quantity: 1 }]
              }
            });
            const updatedCart = res.body.data.cartLinesAdd.cart;
            
             const updatedLines = updatedCart.lines.edges.map((edge: any) => ({
               lineId: edge.node.id,
               quantity: edge.node.quantity,
            }));
            
            // Update lineIds on our local cart state
            const finalCart = get().cart.map((item) => {
               const latestLine = updatedLines.find((l:any) => l.quantity >= item.quantity); // rough match
               if (latestLine) {
                 return { ...item, lineId: latestLine.lineId };
               }
               return item;
            });

            set({ cart: finalCart, isLoading: false, checkoutUrl: updatedCart.checkoutUrl });
          }
        } catch (e) {
          console.error(e);
          set({ isLoading: false });
        }
      },

      updateQuantity: async (lineId, quantity) => {
        const { cartId, cart } = get();
        if (!cartId || !lineId) return;
        
        if (quantity <= 0) {
          return get().removeFromCart(lineId);
        }

        set({
           cart: cart.map(item => item.lineId === lineId ? { ...item, quantity } : item)
        });

        await shopifyFetch({
          query: updateCartMutation,
          variables: {
            cartId,
            lines: [{ id: lineId, quantity }]
          }
        });
      },

      removeFromCart: async (lineId) => {
        const { cartId, cart } = get();
        if (!cartId || !lineId) return;

        set({
           cart: cart.filter(item => item.lineId !== lineId)
        });

        await shopifyFetch({
          query: removeCartLineMutation,
          variables: {
            cartId,
            lineIds: [lineId]
          }
        });
      },
      
      clearCart: () => set({ cart: [], cartId: null, checkoutUrl: null })
    }),
    {
      name: 'cozee-cart-storage',
      partialize: (state) => ({ cart: state.cart, cartId: state.cartId, checkoutUrl: state.checkoutUrl }),
    }
  )
);
