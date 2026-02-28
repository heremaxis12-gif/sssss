import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'cashOnDelivery'
  });

  useEffect(() => {
    // Fetch product details if ID is provided
    if (id) {
      const fetchProduct = async () => {
        try {
          const response = await fetch(`/api/products/${id}`);
          if (response.ok) {
            const data = await response.json();
            setProduct(data);
          }
        } catch (error) {
          console.error('Error fetching product:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchProduct();
    } else {
      setLoading(false);
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.fullName || !formData.phone || !formData.address || !formData.city || !formData.postalCode) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      // Prepare order data
      const orderData = {
        customerName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        products: [{
          productId: product._id,
          name: product.name,
          price: product.discountPercentage 
            ? product.price * (1 - product.discountPercentage / 100) 
            : product.price,
          quantity: 1
        }],
        totalAmount: product.discountPercentage 
          ? product.price * (1 - product.discountPercentage / 100) 
          : product.price,
        paymentMethod: formData.paymentMethod
      };

      // Submit order
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(`Order placed successfully! Your Order ID: ${result.orderId}`);
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        toast.error('Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('An error occurred while placing your order');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F0F0F]">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-[#F5F1E8] py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-[#1a1a1a] rounded-2xl p-8 glass-effect"
        >
          <h1 className="text-3xl font-bold mb-8 h1-luxury text-center">Checkout</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="bg-[#222222] rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4 h2-luxury">Order Summary</h2>
              
              {product && (
                <div className="border-b border-[#D4AF37]/20 pb-4 mb-4">
                  <div className="flex items-center space-x-4">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-lg" />
                    ) : (
                      <div className="w-16 h-16 bg-[#333333] rounded-lg flex items-center justify-center">
                        <span className="text-[#D4AF37] text-xs">No Image</span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-[#D4AF37] font-semibold">
                        ${product.discountPercentage 
                          ? (product.price * (1 - product.discountPercentage / 100)).toFixed(2)
                          : product.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>
                    ${product && (product.discountPercentage 
                      ? (product.price * (1 - product.discountPercentage / 100)).toFixed(2)
                      : product.price.toFixed(2))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between border-t border-[#D4AF37]/20 pt-2 mt-2">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold text-[#D4AF37]">
                    ${product && (product.discountPercentage 
                      ? (product.price * (1 - product.discountPercentage / 100)).toFixed(2)
                      : product.price.toFixed(2))}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Checkout Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#222222] border border-[#D4AF37]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] input-focus"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#222222] border border-[#D4AF37]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] input-focus"
                  placeholder="Enter your phone number"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Full Address *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#222222] border border-[#D4AF37]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] input-focus"
                  placeholder="Enter your address"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#222222] border border-[#D4AF37]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] input-focus"
                    placeholder="Enter city"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Postal Code *</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#222222] border border-[#D4AF37]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] input-focus"
                    placeholder="Enter postal code"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Payment Method</label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#222222] border border-[#D4AF37]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] input-focus"
                >
                  <option value="cashOnDelivery">Cash on Delivery (Pre-selected)</option>
                </select>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-4 bg-[#D4AF37] text-[#0F0F0F] rounded-lg font-bold text-lg animated-button"
              >
                Confirm Order
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CheckoutPage;