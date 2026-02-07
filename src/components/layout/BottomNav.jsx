import { Home, ShoppingBag, User, Package } from 'lucide-react';
import { motion } from 'framer-motion';

const BottomNav = () => {
  const navItems = [
    { icon: Home, label: 'Home', active: true },
    { icon: Package, label: 'Categories' },
    { icon: ShoppingBag, label: 'Orders' },
    { icon: User, label: 'Profile' }
  ];

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-0 left-0 right-0 bg-white border-t z-40"
    >
      <div className="flex justify-around items-center py-3">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`flex flex-col items-center gap-1 transition-all ${
              item.active
                ? 'text-red-500'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <item.icon size={24} />
            <span className="text-xs font-medium">{item.label}</span>
            {item.active && (
              <motion.div
                layoutId="activeTab"
                className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1"
              />
            )}
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default BottomNav;