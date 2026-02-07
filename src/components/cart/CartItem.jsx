import { motion } from 'framer-motion';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { useStore } from '../../store/useStore';

const CartItem = ({ item }) => {
  const updateQuantity = useStore((state) => state.updateQuantity);
  const removeFromCart = useStore((state) => state.removeFromCart);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm"
    >
      <img
        src={item.image}
        alt={item.name}
        className="w-20 h-20 object-cover rounded-lg"
      />
      
      <div className="flex-1">
        <h4 className="font-semibold text-gray-800 line-clamp-1">{item.name}</h4>
        <p className="text-gray-500 text-sm">ETB {item.price.toLocaleString()} each</p>
        
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 12)}
              disabled={item.quantity <= 12}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center disabled:opacity-50"
            >
              <Minus size={16} />
            </button>
            
            <span className="font-bold text-lg min-w-[40px] text-center">
              {item.quantity}
            </span>
            
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 12)}
              className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center"
            >
              <Plus size={16} />
            </button>
          </div>
          
          <div className="text-right">
            <p className="font-bold text-gray-900">
              ETB {(item.price * item.quantity).toLocaleString()}
            </p>
            <button
              onClick={() => removeFromCart(item.id)}
              className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1 mt-1"
            >
              <Trash2 size={14} />
              Remove
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CartItem;