const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['banking', 'electronic']
  },
  name: {
    type: String,
    required: true
  },
  phone1: {
    type: String,
    required: true
  },
  phone2: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    required: true
  },
  amount: {
    type: Number
  },
  service_type: {
    type: String
  },
  bank_type: {
    type: String
  },
  account_type: {
    type: String
  },
  sender_account: {
    type: String
  },
  transfer_to: {
    type: String
  },
  recipient_account: {
    type: String
  },
  recipient_name: {
    type: String
  },
  machine_type: {
    type: String
  },
  merchant_number: {
    type: String
  },
  screenshot: {
    type: String // Base64 encoded image
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'completed', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Request', requestSchema);
