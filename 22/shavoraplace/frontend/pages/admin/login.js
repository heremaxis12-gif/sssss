import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

const AdminLogin = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // Store token in localStorage
        localStorage.setItem('adminToken', data.token);
        toast.success('Login successful!');
        router.push('/admin/dashboard');
      } else {
        toast.error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F0F0F] p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-[#1a1a1a] rounded-2xl p-8 glass-effect"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold h1-luxury mb-2">Admin Portal</h1>
          <p className="text-[#F5F1E8]/70">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#222222] border border-[#D4AF37]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] input-focus"
              placeholder="Enter username"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#222222] border border-[#D4AF37]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] input-focus"
              placeholder="Enter password"
              required
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-medium transition-all duration-300 ${
              loading 
                ? 'bg-[#D4AF37]/50 cursor-not-allowed' 
                : 'bg-[#D4AF37] hover:bg-[#c19e2f] text-[#0F0F0F]'
            } animated-button`}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </motion.button>
        </form>

        <div className="mt-6 text-center text-sm text-[#F5F1E8]/60">
          <p>Default credentials:</p>
          <p>Username: shovra01</p>
          <p>Password: shovraplace1</p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;