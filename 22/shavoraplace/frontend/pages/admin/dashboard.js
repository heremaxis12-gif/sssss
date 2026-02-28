import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import AdminSidebar from '../../components/AdminSidebar';

const AdminDashboard = () => {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    // Fetch dashboard stats
    const fetchStats = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          fetch('/api/orders', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch('/api/products', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        if (ordersRes.ok) {
          const orders = await ordersRes.json();
          const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
          
          setStats({
            totalOrders: orders.length,
            totalRevenue: totalRevenue,
            totalProducts: 0 // Will be updated after fetching products
          });
          
          setRecentOrders(orders.slice(0, 5));
        }

        if (productsRes.ok) {
          const products = await productsRes.json();
          setStats(prev => ({
            ...prev,
            totalProducts: products.length
          }));
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [router]);

  // Animation variants for counter
  const CounterAnimation = ({ value, duration = 2 }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      let start = 0;
      const increment = value / (duration * 50); // 50 frames per second
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(start);
        }
      }, 20);

      return () => clearInterval(timer);
    }, [value, duration]);

    return (
      <motion.span
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-3xl font-bold text-[#D4AF37]"
      >
        {Math.round(count)}
      </motion.span>
    );
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
      <AdminSidebar currentPage="dashboard" />
      
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold h1-luxury">Dashboard</h1>
          <p className="text-[#F5F1E8]/70">Welcome back, Administrator</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-[#1a1a1a] rounded-xl p-6 glass-effect border border-[#D4AF37]/20"
          >
            <h3 className="text-lg font-semibold mb-2 h2-luxury">Total Orders</h3>
            <CounterAnimation value={stats.totalOrders} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-[#1a1a1a] rounded-xl p-6 glass-effect border border-[#D4AF37]/20"
          >
            <h3 className="text-lg font-semibold mb-2 h2-luxury">Total Revenue</h3>
            <CounterAnimation value={stats.totalRevenue} />
            <span className="text-[#F5F1E8]/70 ml-2">USD</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-[#1a1a1a] rounded-xl p-6 glass-effect border border-[#D4AF37]/20"
          >
            <h3 className="text-lg font-semibold mb-2 h2-luxury">Total Products</h3>
            <CounterAnimation value={stats.totalProducts} />
          </motion.div>
        </div>

        {/* Recent Orders */}
        <div className="bg-[#1a1a1a] rounded-xl p-6 glass-effect border border-[#D4AF37]/20">
          <h2 className="text-xl font-semibold mb-6 h2-luxury">Recent Orders</h2>
          
          {recentOrders.length === 0 ? (
            <p className="text-[#F5F1E8]/70">No recent orders</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#D4AF37]/20">
                    <th className="text-left py-3 px-4">Order ID</th>
                    <th className="text-left py-3 px-4">Customer</th>
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-left py-3 px-4">Amount</th>
                    <th className="text-left py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order, index) => (
                    <motion.tr
                      key={order._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="border-b border-[#D4AF37]/10 hover:bg-[#222222]/50"
                    >
                      <td className="py-3 px-4">{order.orderId}</td>
                      <td className="py-3 px-4">{order.customerName}</td>
                      <td className="py-3 px-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-4">${order.totalAmount.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          order.status === 'delivered' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;