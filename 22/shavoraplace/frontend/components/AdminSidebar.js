import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';

const AdminSidebar = ({ currentPage }) => {
  const router = useRouter();

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
    { name: 'Products', path: '/admin/products', icon: '🛍' },
    { name: 'Orders', path: '/admin/orders', icon: '📋' },
    { name: 'Logout', path: '/admin/logout', icon: '🚪' }
  ];

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  return (
    <motion.aside 
      className="w-64 bg-[#0F0F0F] sidebar min-h-screen"
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-6 border-b border-[#D4AF37]/20">
        <h2 className="text-xl font-bold h1-luxury">SHAVORAPLACE</h2>
        <p className="text-[#D4AF37] text-sm">Admin Panel</p>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            if (item.name === 'Logout') {
              return (
                <motion.li
                  key={item.name}
                  whileHover={{ x: 5 }}
                  className="w-full"
                >
                  <button
                    onClick={handleLogout}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 flex items-center space-x-3 ${
                      currentPage === item.name.toLowerCase()
                        ? 'bg-[#D4AF37]/20 text-[#D4AF37] border-r-2 border-[#D4AF37]'
                        : 'hover:bg-[#222222] text-[#F5F1E8]'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                  </button>
                </motion.li>
              );
            }
            
            return (
              <motion.li
                key={item.name}
                whileHover={{ x: 5 }}
                className="w-full"
              >
                <Link href={item.path}>
                  <div
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 flex items-center space-x-3 ${
                      currentPage === item.name.toLowerCase()
                        ? 'bg-[#D4AF37]/20 text-[#D4AF37] border-r-2 border-[#D4AF37]'
                        : 'hover:bg-[#222222] text-[#F5F1E8]'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                  </div>
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </nav>
    </motion.aside>
  );
};

export default AdminSidebar;