const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const artisanSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  services: [{
    _id: { type: String, default: uuidv4 }, // UUID for each service entry
    service: { type: String, ref: 'Service' }, // optional reference
    name: { type: String },
    description: { type: String },
    price: { type: Number },
    duration: { type: Number },
    images: [{ type: String }]
  }],
  portfolio: [{ type: String }],
  address: { type: String },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true },
    name: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String }
  },
  createdAt: { type: Date, default: Date.now }
});

artisanSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Artisan', artisanSchema);