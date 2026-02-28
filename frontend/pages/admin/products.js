import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import AdminSidebar from '../../components/AdminSidebar';
import toast from 'react-hot-toast';

const AdminProducts = () => {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discountPercentage: '',
    stock: '',
    image: null
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    // Fetch products
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    setFormData(prev => ({
      ...prev,
      image: e.target.files[0]
    }));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('price', parseFloat(formData.price));
    formDataToSend.append('discountPercentage', parseFloat(formData.discountPercentage) || 0);
    formDataToSend.append('stock', parseInt(formData.stock));
    
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formDataToSend
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Product added successfully!');
        setShowAddModal(false);
        setFormData({
          name: '',
          description: '',
          price: '',
          discountPercentage: '',
          stock: '',
          image: null
        });
        // Refresh products list
        const updatedResponse = await fetch('/api/products', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (updatedResponse.ok) {
          const updatedProducts = await updatedResponse.json();
          setProducts(updatedProducts);
        }
      } else {
        toast.error(result.message || 'Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('An error occurred while adding the product');
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('price', parseFloat(formData.price));
    formDataToSend.append('discountPercentage', parseFloat(formData.discountPercentage) || 0);
    formDataToSend.append('stock', parseInt(formData.stock));
    
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }

    try {
      const response = await fetch(`/api/products/${currentProduct._id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formDataToSend
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Product updated successfully!');
        setShowEditModal(false);
        setCurrentProduct(null);
        setFormData({
          name: '',
          description: '',
          price: '',
          discountPercentage: '',
          stock: '',
          image: null
        });
        // Refresh products list
        const updatedResponse = await fetch('/api/products', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (updatedResponse.ok) {
          const updatedProducts = await updatedResponse.json();
          setProducts(updatedProducts);
        }
      } else {
        toast.error(result.message || 'Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('An error occurred while updating the product');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    const token = localStorage.getItem('adminToken');

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        toast.success('Product deleted successfully!');
        // Refresh products list
        const updatedResponse = await fetch('/api/products', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (updatedResponse.ok) {
          const updatedProducts = await updatedResponse.json();
          setProducts(updatedProducts);
        }
      } else {
        toast.error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('An error occurred while deleting the product');
    }
  };

  const openEditModal = (product) => {
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      discountPercentage: product.discountPercentage,
      stock: product.stock,
      image: null
    });
    setShowEditModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] text-[#F5F1E8] flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0F0F0F] text-[#F5F1E8]">
      <AdminSidebar currentPage="products" />
      
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold h1-luxury">Products</h1>
            <p className="text-[#F5F1E8]/70">Manage your perfume collection</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="bg-[#D4AF37] text-[#0F0F0F] px-6 py-3 rounded-lg font-medium flex items-center space-x-2 animated-button"
          >
            <span>+</span>
            <span>Add Product</span>
          </motion.button>
        </div>

        {products.length === 0 ? (
          <div className="bg-[#1a1a1a] rounded-xl p-12 text-center glass-effect">
            <p className="text-xl text-[#F5F1E8]/70">No products available</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 bg-[#D4AF37] text-[#0F0F0F] px-4 py-2 rounded-lg font-medium"
            >
              Add First Product
            </button>
          </div>
        ) : (
          <div className="bg-[#1a1a1a] rounded-xl overflow-hidden glass-effect">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#222222]">
                  <tr>
                    <th className="py-4 px-6 text-left">Image</th>
                    <th className="py-4 px-6 text-left">Name</th>
                    <th className="py-4 px-6 text-left">Price</th>
                    <th className="py-4 px-6 text-left">Discount</th>
                    <th className="py-4 px-6 text-left">Stock</th>
                    <th className="py-4 px-6 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <motion.tr
                      key={product._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="border-b border-[#D4AF37]/10 hover:bg-[#222222]/50"
                    >
                      <td className="py-4 px-6">
                        {product.image ? (
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-[#333333] rounded-lg flex items-center justify-center">
                            <span className="text-[#D4AF37] text-xs">No Img</span>
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6 font-medium">{product.name}</td>
                      <td className="py-4 px-6">${product.price.toFixed(2)}</td>
                      <td className="py-4 px-6">
                        {product.discountPercentage > 0 ? `${product.discountPercentage}%` : '-'}
                      </td>
                      <td className="py-4 px-6">{product.stock}</td>
                      <td className="py-4 px-6">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openEditModal(product)}
                            className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded hover:bg-blue-500/30 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product._id)}
                            className="bg-red-500/20 text-red-400 px-3 py-1 rounded hover:bg-red-500/30 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add Product Modal */}
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-[#1a1a1a] rounded-2xl p-6 w-full max-w-md glass-effect border border-[#D4AF37]/20"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-6 h2-luxury">Add New Product</h2>
              
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#222222] border border-[#D4AF37]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] input-focus"
                    placeholder="Enter product name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#222222] border border-[#D4AF37]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] input-focus"
                    placeholder="Enter product description"
                    rows="3"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Price *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#222222] border border-[#D4AF37]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] input-focus"
                    placeholder="Enter price"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Discount Percentage</label>
                  <input
                    type="number"
                    name="discountPercentage"
                    value={formData.discountPercentage}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#222222] border border-[#D4AF37]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] input-focus"
                    placeholder="Enter discount percentage (0-100)"
                    min="0"
                    max="100"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Stock Quantity *</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#222222] border border-[#D4AF37]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] input-focus"
                    placeholder="Enter stock quantity"
                    min="0"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Product Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-4 py-3 bg-[#222222] border border-[#D4AF37]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] input-focus"
                  />
                </div>
                
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-3 bg-[#222222] text-[#F5F1E8] rounded-lg font-medium hover:bg-[#333333] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-[#D4AF37] text-[#0F0F0F] rounded-lg font-medium animated-button"
                  >
                    Add Product
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Edit Product Modal */}
        {showEditModal && currentProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-[#1a1a1a] rounded-2xl p-6 w-full max-w-md glass-effect border border-[#D4AF37]/20"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-6 h2-luxury">Edit Product</h2>
              
              <form onSubmit={handleUpdateProduct} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#222222] border border-[#D4AF37]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] input-focus"
                    placeholder="Enter product name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#222222] border border-[#D4AF37]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] input-focus"
                    placeholder="Enter product description"
                    rows="3"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Price *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#222222] border border-[#D4AF37]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] input-focus"
                    placeholder="Enter price"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Discount Percentage</label>
                  <input
                    type="number"
                    name="discountPercentage"
                    value={formData.discountPercentage}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#222222] border border-[#D4AF37]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] input-focus"
                    placeholder="Enter discount percentage (0-100)"
                    min="0"
                    max="100"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Stock Quantity *</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#222222] border border-[#D4AF37]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] input-focus"
                    placeholder="Enter stock quantity"
                    min="0"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Product Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-4 py-3 bg-[#222222] border border-[#D4AF37]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] input-focus"
                  />
                  {currentProduct.image && !formData.image && (
                    <div className="mt-2">
                      <p className="text-sm text-[#F5F1E8]/70">Current image:</p>
                      <img 
                        src={currentProduct.image} 
                        alt={currentProduct.name} 
                        className="w-16 h-16 object-cover rounded-lg mt-1"
                      />
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 py-3 bg-[#222222] text-[#F5F1E8] rounded-lg font-medium hover:bg-[#333333] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-[#D4AF37] text-[#0F0F0F] rounded-lg font-medium animated-button"
                  >
                    Update Product
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;