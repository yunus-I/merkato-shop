import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set, get) => ({
      // Cart state
      cart: [],
      addToCart: (product, quantity = 12) => {
        set((state) => {
          const existingItem = state.cart.find(item => item.id === product.id);
          
          if (existingItem) {
            return {
              cart: state.cart.map(item =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              )
            };
          }
          
          return {
            cart: [...state.cart, { ...product, quantity }]
          };
        });
      },
      removeFromCart: (productId) => {
        set((state) => ({
          cart: state.cart.filter(item => item.id !== productId)
        }));
      },
      updateQuantity: (productId, quantity) => {
        set((state) => ({
          cart: state.cart.map(item =>
            item.id === productId
              ? { ...item, quantity: Math.max(12, quantity) }
              : item
          )
        }));
      },
      clearCart: () => set({ cart: [] }),
      
      // Language state
      language: 'en',
      setLanguage: (lang) => set({ language: lang }),
      
      // User state
      user: null,
      setUser: (userData) => set({ user: userData }),
      
      // Theme state
      theme: 'light',
      setTheme: (theme) => set({ theme }),
      
      // Calculate totals
      getCartTotal: () => {
        const { cart } = get();
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
      
      getCartCount: () => {
        const { cart } = get();
        return cart.reduce((count, item) => count + item.quantity, 0);
      }
    }),
    {
      name: 'merkato-shop-storage',
      getStorage: () => localStorage,
    }
  )
);