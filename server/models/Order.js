const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  product_name: {
    type: String,
    required: true
  },
  product_price: {
    type: Number,
    required: true
  },
  product_image: {
    type: String // Base64 or URL
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  customer_name: {
    type: String,
    required: true
  },
  customer_address: {
    type: String,
    required: true
  },
  customer_phone1: {
    type: String,
    required: true
  },
  customer_phone2: {
    type: String,
    default: ''
  },
  delivery_fee: {
    type: Number,
    default: 120
  },
  total_price: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
