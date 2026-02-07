import { ShoppingBag, Menu, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import Button from '../common/Button';

const Navbar = ({ onCartClick, onMenuClick }) => {
  const getCartCount = useStore((state) => state.getCartCount);
  const language = useStore((state) => state.language);
  const setLanguage = useStore((state) => state.setLanguage);

  const languages = [
    { code: 'en', label: 'EN' },
    { code: 'am', label: 'አማ' },
    { code: 'or', label: 'Orom' }
  ];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b"
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left: Logo and Menu */}
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuClick}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu size={24} />
            </button>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">M</span>
              </div>
              <span className="font-bold text-xl text-gray-900">Merkato Shop</span>
            </div>
          </div>
          
          {/* Right: Language and Cart */}
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                    language === lang.code
                      ? 'bg-white text-red-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
            
            {/* Cart Button */}
            <button
              onClick={onCartClick}
              className="relative p-2 hover:bg-gray-100 rounded-lg"
            >
              <ShoppingBag size={24} />
              {getCartCount() > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
                >
                  {getCartCount() > 99 ? '99+' : getCartCount()}
                </motion.span>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;