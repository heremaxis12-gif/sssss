const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Create default admin user on startup if not exists
const createDefaultAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ username: 'shovra01' });
    
    if (!existingAdmin) {
      const hashedPassword = await require('bcrypt').hash('shovraplace1', 10);
      const adminUser = new User({
        username: 'shovra01',
        password: hashedPassword,
        role: 'admin'
      });
      
      await adminUser.save();
      console.log('Default admin user created: shovra01 / shovraplace1');
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
};

// Call this function when module loads
createDefaultAdmin();

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ 
        message: 'Username and password are required.' 
      });
    }

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid credentials.' 
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        message: 'Invalid credentials.' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret_key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Server error during login.' 
    });
  }
});

// Verify token (protected route)
router.get('/verify', auth, (req, res) => {
  res.json({
    valid: true,
    user: {
      id: req.user._id,
      username: req.user.username,
      role: req.user.role
    }
  });
});

module.exports = router;