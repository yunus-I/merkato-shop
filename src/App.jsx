import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import BottomNav from './components/layout/BottomNav';
import ProductGrid from './components/products/ProductGrid';
import CartDrawer from './components/cart/CartDrawer';
import CheckoutForm from './components/checkout/CheckoutForm';
import { useTelegram } from './hooks/useTelegram';
import { useStore } from './store/useStore';

const queryClient = new QueryClient();

function AppContent() {
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const { tg } = useTelegram();
  const getCartCount = useStore((state) => state.getCartCount);

  // Notify Telegram about cart changes
  useEffect(() => {
    if (tg) {
      const cartCount = getCartCount();
      tg.MainButton.setText(`Cart (${cartCount} items)`);
      tg.MainButton.show();
      
      tg.MainButton.onClick(() => setCartOpen(true));
    }
  }, [tg, getCartCount]);

  const handleCheckoutSuccess = (order) => {
    setOrderComplete(true);
    setCheckoutOpen(false);
    
    // Show success message
    if (tg) {
      tg.showAlert(`Order #${order.orderNumber} placed successfully! 10% paid, 90% due on delivery.`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar
        onCartClick={() => setCartOpen(true)}
        onMenuClick={() => {
          // Implement menu functionality
        }}
      />
      
      <main>
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-red-600 to-red-500 text-white p-6">
          <h1 className="text-3xl font-bold mb-2">Wholesale Marketplace</h1>
          <p className="opacity-90">Buy socks, underwear & belts by the dozen</p>
          <div className="flex gap-2 mt-4">
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
              Min. order: 12 pieces
            </span>
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
              Bulk discounts
            </span>
          </div>
        </div>
        
        {/* Products */}
        <ProductGrid />
      </main>
      
      {/* Cart Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
      />
      
      {/* Checkout Modal */}
      <AnimatePresence>
        {checkoutOpen && (
          <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
            <CheckoutForm
              onSuccess={handleCheckoutSuccess}
              onBack={() => setCheckoutOpen(false)}
            />
          </div>
        )}
      </AnimatePresence>
      
      {/* Order Complete Modal */}
      <AnimatePresence>
        {orderComplete && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full text-center"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2">Order Confirmed!</h2>
              <p className="text-gray-600 mb-6">
                Your wholesale order has been placed successfully. You'll receive a confirmation call shortly.
              </p>
              <button
                onClick={() => setOrderComplete(false)}
                className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold"
              >
                Continue Shopping
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      <BottomNav />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;