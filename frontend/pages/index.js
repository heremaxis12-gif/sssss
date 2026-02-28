import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch products from API
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-[#F5F1E8]">
      {/* Header */}
      <header className="fixed top-0 w-full py-6 px-8 z-50 bg-[#0F0F0F]/80 backdrop-blur-md border-b border-[#D4AF37]/20">
        <div className="container mx-auto flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-2xl font-bold h1-luxury"
          >
            SHAVORAPLACE
          </motion.div>
          
          <nav>
            <ul className="flex space-x-8">
              <motion.li whileHover={{ scale: 1.05 }}>
                <Link href="/admin/login" className="text-[#D4AF37] hover:text-[#F5F1E8] transition-colors">
                  Admin
                </Link>
              </motion.li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-8">
        <div className="container mx-auto text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-6 h1-luxury"
          >
            Luxury Perfumes
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-[#F5F1E8]/80 max-w-2xl mx-auto p-luxury"
          >
            Discover our exquisite collection of premium fragrances crafted for the discerning individual.
          </motion.p>
        </div>
      </section>

      {/* Products Section */}
      <section className="pb-16 px-8">
        <div className="container mx-auto">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-semibold mb-12 h2-luxury"
          >
            Our Collection
          </motion.h2>
          
          {products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl">No products available at the moment.</p>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {products.map((product, index) => (
                <motion.div
                  key={product._id || index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-8 border-t border-[#D4AF37]/20">
        <div className="container mx-auto text-center">
          <p className="text-[#F5F1E8]/60 p-luxury">
            © 2026 Shavoraplace. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;