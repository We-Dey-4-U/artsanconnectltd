const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const orderSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  artisan: { type: String, ref: 'Artisan', required: true },
  customer: { type: String, ref: 'Customer', required: true },
   // snapshot of service at time of booking yes
  service: {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number },
    duration: { type: Number }
  },
  scheduledDate: { type: Date, required: true },
  status: { type: String, enum: ['pending','accepted','completed','cancelled'], default: 'pending' },
  price: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);