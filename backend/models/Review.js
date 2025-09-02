const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const reviewSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  name: { type: String, required: true },        // Customer name
  role: { type: String, default: 'Customer' },   // Optional: role of reviewer
  feedback: { type: String, required: true },
  customerId: { type: String, ref: 'Customer' }, // Optional reference
  artisanId: { type: String, ref: 'Artisan' },   // Optional: for reviewing specific artisan
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', reviewSchema);