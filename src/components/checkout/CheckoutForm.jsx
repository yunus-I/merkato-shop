import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { orderService } from '../../services/firebase';
import { useStore } from '../../store/useStore';
import Button from '../common/Button';
import { useTelegram } from '../../hooks/useTelegram';

const CheckoutForm = ({ onSuccess, onBack }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const cart = useStore((state) => state.cart);
  const getCartTotal = useStore((state) => state.getCartTotal);
  const clearCart = useStore((state) => state.clearCart);
  const { sendData, user: tgUser } = useTelegram();

  const onSubmit = async (data) => {
    setLoading(true);
    
    const orderData = {
      customer: {
        name: data.name,
        phone: data.phone,
        telegramId: tgUser?.id || null,
        username: tgUser?.username || null
      },
      items: cart,
      subtotal: getCartTotal(),
      downPayment: getCartTotal() * 0.1,
      deliveryPayment: getCartTotal() * 0.9,
      total: getCartTotal(),
      deliveryAddress: data.address,
      notes: data.notes || '',
      paymentMethod: 'cash_on_delivery',
      platform: 'telegram_mini_app'
    };

    try {
      const order = await orderService.createOrder(orderData);
      
      // Send data back to Telegram bot if in Telegram
      if (window.Telegram?.WebApp) {
        sendData({
          type: 'order_created',
          orderId: order.id,
          orderNumber: order.orderNumber,
          total: order.total
        });
      }
      
      clearCart();
      onSuccess(order);
    } catch (error) {
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto p-6"
    >
      <h2 className="text-2xl font-bold mb-6">Checkout</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            {...register('name', { required: 'Name is required' })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="John Doe"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number *
          </label>
          <input
            {...register('phone', {
              required: 'Phone is required',
              pattern: {
                value: /^[0-9+\-\s()]*$/,
                message: 'Invalid phone number'
              }
            })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="+251 91 234 5678"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Delivery Address *
          </label>
          <textarea
            {...register('address', { required: 'Address is required' })}
            rows="3"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Your complete delivery address"
          />
          {errors.address && (
            <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Order Notes (Optional)
          </label>
          <textarea
            {...register('notes')}
            rows="2"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Any special instructions..."
          />
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg mt-6">
          <h3 className="font-semibold mb-2">Order Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Items ({cart.length})</span>
              <span>ETB {getCartTotal().toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Down Payment (10%)</span>
              <span className="text-green-600 font-semibold">
                ETB {(getCartTotal() * 0.1).toLocaleString()}
              </span>
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-bold">
                <span>Due on Delivery (90%)</span>
                <span>ETB {(getCartTotal() * 0.9).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            onClick={onBack}
            variant="outline"
            fullWidth
          >
            Back to Cart
          </Button>
          <Button
            type="submit"
            loading={loading}
            fullWidth
          >
            Place Order
          </Button>
        </div>
        
        <p className="text-gray-500 text-sm text-center mt-4">
          You'll pay 10% now and 90% when your order arrives
        </p>
      </form>
    </motion.div>
  );
};

export default CheckoutForm;