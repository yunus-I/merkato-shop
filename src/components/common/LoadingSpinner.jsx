import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 'md', color = 'primary' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const colors = {
    primary: 'border-red-500',
    white: 'border-white'
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex justify-center items-center"
    >
      <div
        className={`${sizes[size]} ${colors[color]} border-2 border-t-transparent rounded-full animate-spin`}
      />
    </motion.div>
  );
};

export default LoadingSpinner;