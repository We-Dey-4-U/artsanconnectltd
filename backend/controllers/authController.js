const Artisan = require('../models/Artisan');
const Customer = require('../models/Customer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '1y' });

// ------------------- Reverse Geocoding -------------------
const getLocationDetails = async (lat, lng) => {
  try {
    const res = await axios.get('https://nominatim.openstreetmap.org/reverse', {
      params: { lat, lon: lng, format: 'json' },
      headers: { 'User-Agent': 'ArtisanApp/1.0' }
    });

    const addr = res.data.address || {};

    // Use display_name as ultimate fallback
    const name =
      addr.suburb ||
      addr.neighbourhood ||
      addr.village ||
      addr.hamlet ||
      addr.road ||
      addr.residential ||
      res.data.display_name ||
      'Unknown Location';

    return {
      name,
      city: addr.city || addr.town || addr.village || addr.county || 'Unknown City',
      state: addr.state || 'Unknown State',
      country: addr.country || 'Unknown Country'
    };
  } catch (err) {
    console.error('Reverse geocoding error:', err.message);
    return {
      name: 'Unknown Location',
      city: 'Unknown City',
      state: 'Unknown State',
      country: 'Unknown Country'
    };
  }
};

// ------------------- Register Artisan -------------------
exports.registerArtisan = async (req, res) => {
  const { name, email, password, phone, address, location } = req.body;

  try {
    if (await Artisan.findOne({ email })) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Default location object
    let locationObj = {
      type: 'Point',
      coordinates: [0, 0],
      name: 'Unknown Location',
      city: 'Unknown City',
      state: 'Unknown State',
      country: 'Unknown Country'
    };

    // Only populate if frontend sent lat/lng
    if (location && location.lat != null && location.lng != null) {
      const lat = parseFloat(location.lat);
      const lng = parseFloat(location.lng);

      if (!isNaN(lat) && !isNaN(lng)) {
        const locDetails = await getLocationDetails(lat, lng);
        locationObj = {
          type: 'Point',
          coordinates: [lng, lat], // MongoDB GeoJSON expects [lng, lat]
          ...locDetails
        };
      }
    }

    const artisan = await Artisan.create({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      phone: phone || '',
      address: address || '',
      location: locationObj
    });

    const token = generateToken(artisan._id, 'artisan');

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        _id: artisan._id,
        name: artisan.name,
        email: artisan.email,
        role: 'artisan',
        address: artisan.address,
        location: artisan.location
      }
    });

  } catch (err) {
    console.error('Register artisan error:', err);
    res.status(500).json({ message: err.message });
  }
};



// ------------------- Register Customer -------------------
exports.registerCustomer = async (req, res) => {
  const { name, email, password, phone, address } = req.body;

  try {
    if (await Customer.findOne({ email })) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const customer = await Customer.create({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      phone: phone || '',
      address: address || ''
    });

    const token = generateToken(customer._id, 'customer');

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: { _id: customer._id, name: customer.name, email: customer.email, role: 'customer' }
    });
  } catch (err) {
    console.error('Register customer error:', err);
    res.status(500).json({ message: err.message });
  }
};

// ------------------- Login -------------------
exports.login = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const Model = role === 'artisan' ? Artisan : Customer;
    const user = await Model.findOne({ email });

    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken(user._id, role);
    res.json({ token, user: { _id: user._id, name: user.name, email: user.email, role } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: err.message });
  }
};