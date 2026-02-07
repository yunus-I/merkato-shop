import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import LoadingSpinner from '../common/LoadingSpinner';
import { useQuery } from '@tanstack/react-query';
import { productService } from '../../services/firebase';

const ProductGrid = () => {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: productService.getFeaturedProducts,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500">Failed to load products</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 text-red-500 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4"
    >
      {products?.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </motion.div>
  );
};

export default ProductGrid;