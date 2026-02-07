import { motion } from 'framer-motion';
import { ShoppingBag, Star } from 'lucide-react';
import Button from '../common/Button';
import { useStore } from '../../store/useStore';
import { useTelegram } from '../../hooks/useTelegram';

const ProductCard = ({ product, index }) => {
  const addToCart = useStore((state) => state.addToCart);
  const { tg } = useTelegram();
  
  const handleAddToCart = () => {
    addToCart(product);
    
    // Haptic feedback on Telegram
    if (tg) {
      tg.HapticFeedback.impactOccurred('medium');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden group cursor-pointer"
    >
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {product.discount > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
            -{product.discount}%
          </div>
        )}
        
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Out of Stock</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-gray-800 text-lg line-clamp-1">{product.name}</h3>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-semibold">{product.rating}</span>
            <span className="text-gray-400 text-sm">({product.reviews})</span>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">
                ETB {product.price.toLocaleString()}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-gray-400 line-through text-sm">
                  ETB {product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            <p className="text-gray-500 text-sm mt-1">Min. order: {product.minOrder} pcs</p>
          </div>
        </div>
        
        <Button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          fullWidth
          icon={ShoppingBag}
        >
          Add to Cart
        </Button>
      </div>
    </motion.div>
  );
};

export default ProductCard;