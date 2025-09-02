const Artisan = require('../models/Artisan');
const Service = require('../models/Service');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

// ------------------- Helper: Reverse Geocoding -------------------
const getLocationDetails = async (lat, lng) => {
  try {
    console.log(`Reverse geocoding for lat: ${lat}, lng: ${lng}`);
    const res = await axios.get('https://nominatim.openstreetmap.org/reverse', {
      params: { lat, lon: lng, format: 'json' },
      headers: { 'User-Agent': 'ArtisanApp/1.0' }
    });
    const addr = res.data.address || {};
    const locationDetails = {
      name: addr.suburb || addr.neighbourhood || addr.village || addr.hamlet || '',
      city: addr.city || addr.town || '',
      state: addr.state || '',
      country: addr.country || ''
    };
    console.log('Reverse geocode result:', locationDetails);
    return locationDetails;
  } catch (err) {
    console.error('Reverse geocoding failed:', err.message);
    return { name: '', city: '', state: '', country: '' };
  }
};




// ------------------- Nearby Artisans -------------------
exports.findNearbyArtisans = async (req, res) => {
  const { lat, lng } = req.query;
  console.log('Finding nearby artisans for:', req.query);

  if (!lat || !lng) {
    console.error('Latitude or longitude missing');
    return res.status(400).json({ message: 'Latitude and longitude required' });
  }

  try {
    const loc = await getLocationDetails(parseFloat(lat), parseFloat(lng));
    console.log('Location details:', loc);

    let artisans = await Artisan.find({ 'location.name': loc.name });
    if (artisans.length) return res.json(artisans);

    artisans = await Artisan.find({ 'location.city': loc.city });
    if (artisans.length) return res.json(artisans);

    artisans = await Artisan.find({ 'location.state': loc.state });
    if (artisans.length) return res.json(artisans);

    artisans = await Artisan.aggregate([
      {
        $geoNear: {
          near: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          distanceField: 'distance',
          spherical: true,
          maxDistance: 50000
        }
      }
    ]);
    res.json(artisans);
  } catch (err) {
    console.error('Error finding nearby artisans:', err.message);
    res.status(500).json({ message: err.message });
  }
};

// ------------------- Upload Portfolio -------------------
exports.uploadPortfolio = async (req, res) => {
  console.log('Uploading portfolio for artisan ID:', req.params.id, 'files:', req.files);
  try {
    const artisan = await Artisan.findById(req.params.id);
    if (!artisan) {
      console.error('Artisan not found');
      return res.status(404).json({ message: 'Artisan not found' });
    }

    artisan.portfolio.push(...req.files.map(f => f.path));
    await artisan.save();
    console.log('Portfolio updated successfully');
    res.json({ portfolio: artisan.portfolio });
  } catch (err) {
    console.error('Upload portfolio error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

// ------------------- Add Artisan Service -------------------
exports.addService = async (req, res) => {
  console.log('Adding service for artisan ID:', req.params.id, 'body:', req.body);
  try {
    const { name, description, price, duration } = req.body;
    const artisan = await Artisan.findById(req.params.id);
    if (!artisan) {
      console.error('Artisan not found');
      return res.status(404).json({ message: 'Artisan not found' });
    }

    const newService = {
      _id: uuidv4(),
      service: null,
      name,
      description,
      price,
      duration,
      images: [],
    };

    artisan.services.push(newService);
    await artisan.save();
    console.log('Service added successfully:', newService);
    res.status(201).json({ message: 'Service added', service: newService });
  } catch (err) {
    console.error('Add service error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

// ------------------- Upload Service Images -------------------
exports.uploadServiceImages = async (req, res) => {
  console.log('Uploading service images for artisan:', req.params.artisanId, 'service:', req.params.serviceId, 'files:', req.files);

  try {
    const { artisanId, serviceId } = req.params;
    const artisan = await Artisan.findById(artisanId);
    if (!artisan) {
      console.error('Artisan not found');
      return res.status(404).json({ message: 'Artisan not found' });
    }

    const svc = artisan.services.find(s => s._id === serviceId);
    if (!svc) {
      console.error('Service not found');
      return res.status(404).json({ message: 'Service not found' });
    }

    svc.images.push(...req.files.map(f => f.path));
    await artisan.save();
    console.log('Service images uploaded successfully:', svc.images);

    res.json({ message: 'Service images uploaded', images: svc.images });
  } catch (err) {
    console.error('Upload service images error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

// ------------------- Add Existing Service by ID -------------------
exports.addArtisanService = async (req, res) => {
  console.log('Adding existing service reference for artisan ID:', req.params.id, 'body:', req.body);
  try {
    const { serviceId } = req.body;
    const artisan = await Artisan.findById(req.params.id);
    if (!artisan) {
      console.error('Artisan not found');
      return res.status(404).json({ message: 'Artisan not found' });
    }

    artisan.services.push({ service: serviceId, images: [] });
    await artisan.save();
    console.log('Existing service added successfully');
    res.json({ services: artisan.services });
  } catch (err) {
    console.error('Add existing service error:', err.message);
    res.status(500).json({ message: err.message });
  }
};



// ------------------- Get all services for a specific artisan -------------------
exports.getArtisanServices = async (req, res) => {
  try {
    const artisanId = req.params.artisanId;
    const artisan = await Artisan.findById(artisanId);

    if (!artisan) {
      return res.status(404).json({ message: "Artisan not found" });
    }

    res.json({ services: artisan.services });
  } catch (err) {
    console.error("Error fetching artisan services:", err.message);
    res.status(500).json({ message: err.message });
  }
};


// Fetch artisans by service name
exports.getArtisansByService = async (req, res) => {
  const { service } = req.query;

  if (!service) {
    return res.status(400).json({ message: 'Service is required' });
  }

  try {
    // Find artisans who offer this service (match by name in services array)
    const artisans = await Artisan.find({ 'services.name': service });
    res.json(artisans);
  } catch (err) {
    console.error('Error fetching artisans by service:', err.message);
    res.status(500).json({ message: err.message });
  }
};