const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [500, 'Product description cannot exceed 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  discountPercentage: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100%']
  },
  finalPrice: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: [true, 'Product image is required']
  },
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative']
  }
}, {
  timestamps: true
});

// Calculate final price before saving
productSchema.pre('save', function(next) {
  if (this.discountPercentage > 0) {
    this.finalPrice = this.price * (1 - this.discountPercentage / 100);
  } else {
    this.finalPrice = this.price;
  }
  next();
});

// Update final price before findOneAndUpdate
productSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  if (update.price !== undefined || update.discountPercentage !== undefined) {
    if (update.discountPercentage > 0) {
      update.finalPrice = update.price * (1 - update.discountPercentage / 100);
    } else {
      update.finalPrice = update.price;
    }
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);