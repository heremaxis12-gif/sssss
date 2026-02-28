import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import AdminSidebar from '../../components/AdminSidebar';
import toast from 'react-hot-toast';

const AdminOrders = () => {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    // Fetch orders
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [router]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    const token = localStorage.getItem('adminToken');

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        toast.success('Order status updated successfully!');
        // Refresh orders list
        const updatedResponse = await fetch('/api/orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (updatedResponse.ok) {
          const updatedOrders = await updatedResponse.json();
          setOrders(updatedOrders);
        }
      } else {
        toast.error('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('An error occurred while updating the order status');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) {
      return;
    }

    const token = localStorage.getItem('adminToken');

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        toast.success('Order deleted successfully!');
        // Refresh orders list
        const updatedResponse = await fetch('/api/orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (updatedResponse.ok) {
          const updatedOrders = await updatedResponse.json();
          setOrders(updatedOrders);
        }
      } else {
        toast.error('Failed to delete order');
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error('An error occurred while deleting the order');
    }
  };

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowDetails(true);
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
      <AdminSidebar currentPage="orders" />
      
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold h1-luxury">Orders</h1>
          <p className="text-[#F5F1E8]/70">Manage customer orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-[#1a1a1a] rounded-xl p-12 text-center glass-effect">
            <p className="text-xl text-[#F5F1E8]/70">No orders available</p>
          </div>
        ) : (
          <div className="bg-[#1a1a1a] rounded-xl overflow-hidden glass-effect">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#222222]">
                  <tr>
                    <th className="py-4 px-6 text-left">Order ID</th>
                    <th className="py-4 px-6 text-left">Customer</th>
                    <th className="py-4 px-6 text-left">Phone</th>
                    <th className="py-4 px-6 text-left">Date</th>
                    <th className="py-4 px-6 text-left">Amount</th>
                    <th className="py-4 px-6 text-left">Status</th>
                    <th className="py-4 px-6 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <motion.tr
                      key={order._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="border-b border-[#D4AF37]/10 hover:bg-[#222222]/50"
                    >
                      <td className="py-4 px-6 font-mono">{order.orderId}</td>
                      <td className="py-4 px-6">{order.customerName}</td>
                      <td className="py-4 px-6">{order.phone}</td>
                      <td className="py-4 px-6">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="py-4 px-6">${order.totalAmount.toFixed(2)}</td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          order.status === 'delivered' 
                            ? 'bg-green-500/20 text-green-400' 
                            : order.status === 'pending'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openOrderDetails(order)}
                            className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded hover:bg-blue-500/30 transition-colors"
                          >
                            Details
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(order._id, order.status === 'pending' ? 'delivered' : 'pending')}
                            className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded hover:bg-purple-500/30 transition-colors"
                          >
                            {order.status === 'pending' ? 'Mark Delivered' : 'Mark Pending'}
                          </button>
                          <button
                            onClick={() => handleDeleteOrder(order._id)}
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

        {/* Order Details Modal */}
        {showDetails && selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-[#1a1a1a] rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto glass-effect border border-[#D4AF37]/20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold h2-luxury">Order Details</h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-[#F5F1E8]/70 hover:text-[#F5F1E8] text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-[#F5F1E8]/70">Order ID</p>
                    <p className="font-mono">{selectedOrder.orderId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#F5F1E8]/70">Status</p>
                    <p>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        selectedOrder.status === 'delivered' 
                          ? 'bg-green-500/20 text-green-400' 
                          : selectedOrder.status === 'pending'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {selectedOrder.status}
                      </span>
                    </p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-[#F5F1E8]/70">Customer Name</p>
                  <p>{selectedOrder.customerName}</p>
                </div>
                
                <div>
                  <p className="text-sm text-[#F5F1E8]/70">Phone</p>
                  <p>{selectedOrder.phone}</p>
                </div>
                
                <div>
                  <p className="text-sm text-[#F5F1E8]/70">Address</p>
                  <p>{selectedOrder.address}, {selectedOrder.city}, {selectedOrder.postalCode}</p>
                </div>
                
                <div>
                  <p className="text-sm text-[#F5F1E8]/70">Payment Method</p>
                  <p>{selectedOrder.paymentMethod}</p>
                </div>
                
                <div>
                  <p className="text-sm text-[#F5F1E8]/70">Order Date</p>
                  <p>{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
                
                <div>
                  <p className="text-sm text-[#F5F1E8]/70">Products</p>
                  <div className="mt-2 space-y-2">
                    {selectedOrder.products.map((product, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 bg-[#222222] rounded-lg">
                        <div>
                          <p className="font-medium">{product.name}</p>
                        </div>
                        <div className="text-right">
                          <p>${product.price.toFixed(2)}</p>
                          <p className="text-sm text-[#F5F1E8]/70">Qty: {product.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="pt-4 border-t border-[#D4AF37]/20">
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-semibold">Total Amount</p>
                    <p className="text-xl font-bold text-[#D4AF37]">${selectedOrder.totalAmount.toFixed(2)}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-4 pt-6">
                <button
                  onClick={() => handleUpdateStatus(selectedOrder._id, selectedOrder.status === 'pending' ? 'delivered' : 'pending')}
                  className="flex-1 py-3 bg-purple-500/20 text-purple-400 rounded-lg font-medium hover:bg-purple-500/30 transition-colors"
                >
                  {selectedOrder.status === 'pending' ? 'Mark as Delivered' : 'Mark as Pending'}
                </button>
                <button
                  onClick={() => handleDeleteOrder(selectedOrder._id)}
                  className="flex-1 py-3 bg-red-500/20 text-red-400 rounded-lg font-medium hover:bg-red-500/30 transition-colors"
                >
                  Delete Order
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;