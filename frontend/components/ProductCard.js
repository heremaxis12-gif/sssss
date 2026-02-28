import { motion } from 'framer-motion';
import Link from 'next/link';

const ProductCard = ({ product }) => {
  const finalPrice = product.discountPercentage 
    ? product.price * (1 - product.discountPercentage / 100) 
    : product.price;

  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="bg-[#0F0F0F] rounded-xl overflow-hidden border border-[#D4AF37]/20 product-card glass-effect"
    >
      <div className="relative overflow-hidden">
        {product.image ? (
          <motion.img
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-cover transition-transform duration-500"
            whileHover={{ scale: 1.05 }}
          />
        ) : (
          <div className="w-full h-64 bg-[#1a1a1a] flex items-center justify-center">
            <span className="text-[#D4AF37]">No Image</span>
          </div>
        )}
        
        {product.discountPercentage > 0 && (
          <div className="absolute top-4 right-4 bg-[#D4AF37] text-[#0F0F0F] px-3 py-1 rounded-full text-sm font-bold">
            -{product.discountPercentage}%
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 h2-luxury">{product.name}</h3>
        <p className="text-[#F5F1E8]/70 mb-4 text-sm p-luxury">{product.description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {product.discountPercentage > 0 ? (
              <>
                <span className="text-lg font-bold text-[#D4AF37]">${finalPrice.toFixed(2)}</span>
                <span className="text-sm text-[#F5F1E8]/50 line-through">${product.price.toFixed(2)}</span>
              </>
            ) : (
              <span className="text-lg font-bold text-[#D4AF37]">${product.price.toFixed(2)}</span>
            )}
          </div>
        </div>
        
        <Link href={`/checkout?id=${product._id}`}>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 bg-[#D4AF37] text-[#0F0F0F] rounded-lg font-medium animated-button transition-all duration-300"
          >
            Buy Now
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
};

export default ProductCard;