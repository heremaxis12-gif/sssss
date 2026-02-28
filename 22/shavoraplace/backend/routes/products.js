const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer with Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'shavoraplace_products',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ width: 800, height: 800, crop: 'limit' }]
  },
});

const upload = multer({ storage: storage });

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error while fetching products' });
  }
});

// Get a single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Server error while fetching product' });
  }
});

// Create a new product (admin only)
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }

    const { name, description, price, discountPercentage, stock } = req.body;

    // Validate required fields
    if (!name || !description || !price || !stock) {
      return res.status(400).json({ 
        message: 'Name, description, price, and stock are required.' 
      });
    }

    // Convert string values to appropriate types
    const numericPrice = parseFloat(price);
    const numericDiscount = parseFloat(discountPercentage) || 0;
    const numericStock = parseInt(stock);

    if (isNaN(numericPrice) || numericPrice <= 0) {
      return res.status(400).json({ message: 'Price must be a positive number.' });
    }

    if (isNaN(numericDiscount) || numericDiscount < 0 || numericDiscount > 100) {
      return res.status(400).json({ message: 'Discount percentage must be between 0 and 100.' });
    }

    if (isNaN(numericStock) || numericStock < 0) {
      return res.status(400).json({ message: 'Stock must be a non-negative number.' });
    }

    // Create new product
    const product = new Product({
      name,
      description,
      price: numericPrice,
      discountPercentage: numericDiscount,
      stock: numericStock,
      image: req.file ? req.file.path : null
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Server error while creating product' });
  }
});

// Update a product (admin only)
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }

    const { name, description, price, discountPercentage, stock } = req.body;

    // Prepare update object
    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (price) updateData.price = parseFloat(price);
    if (discountPercentage) updateData.discountPercentage = parseFloat(discountPercentage);
    if (stock) updateData.stock = parseInt(stock);
    if (req.file) updateData.image = req.file.path;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Server error while updating product' });
  }
});

// Delete a product (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }

    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Server error while deleting product' });
  }
});

module.exports = router;