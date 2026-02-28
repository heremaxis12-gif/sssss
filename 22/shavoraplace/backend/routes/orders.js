const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const router = express.Router();

// Generate unique order ID
const generateOrderId = () => {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substr(2, 5);
  return `ORD${timestamp}${randomPart}`.toUpperCase();
};

// Get all orders (admin only)
router.get('/', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }

    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error while fetching orders' });
  }
});

// Get a single order by ID (admin only)
router.get('/:id', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }

    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Server error while fetching order' });
  }
});

// Create a new order (public)
router.post('/', async (req, res) => {
  try {
    const {
      customerName,
      phone,
      address,
      city,
      postalCode,
      products,
      totalAmount,
      paymentMethod = 'cashOnDelivery'
    } = req.body;

    // Validate required fields
    if (!customerName || !phone || !address || !city || !postalCode || !products || products.length === 0 || !totalAmount) {
      return res.status(400).json({ 
        message: 'Customer name, phone, address, city, postal code, products, and total amount are required.' 
      });
    }

    // Validate payment method
    if (paymentMethod !== 'cashOnDelivery') {
      return res.status(400).json({ message: 'Invalid payment method. Only cash on delivery is supported.' });
    }

    // Validate products and check stock availability
    for (const item of products) {
      if (!item.productId || !item.name || !item.price || !item.quantity) {
        return res.status(400).json({ message: 'Each product must have productId, name, price, and quantity.' });
      }

      if (item.quantity <= 0) {
        return res.status(400).json({ message: 'Product quantity must be greater than 0.' });
      }

      // Check if product exists and has enough stock
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product with ID ${item.productId} not found.` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}` });
      }
    }

    // Create new order
    const order = new Order({
      orderId: generateOrderId(),
      customerName,
      phone,
      address,
      city,
      postalCode,
      products,
      totalAmount,
      paymentMethod
    });

    // Save the order
    await order.save();

    // Update stock for each product
    for (const item of products) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.quantity } },
        { new: true }
      );
    }

    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Server error while creating order' });
  }
});

// Update an order (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }

    const { status } = req.body;

    // Validate status
    if (status && !['pending', 'delivered'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Only "pending" and "delivered" are allowed.' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: 'Server error while updating order' });
  }
});

// Delete an order (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }

    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: 'Server error while deleting order' });
  }
});

module.exports = router;