const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const {
  findNearbyArtisans,
  uploadPortfolio,
  addService,
  addArtisanService,
  uploadServiceImages,
  getArtisanServices
} = require('../controllers/artisanController');

// ------------------- Artisan Portfolio -------------------
router.post(
  '/portfolio/:id',
  protect,
  upload.array('images', 5),
  uploadPortfolio
);

// ------------------- Artisan Services -------------------
// Add a new service specifically for this artisan
router.post('/:id/add-service', protect, addService);

// Add an existing service reference (from Service collection) to artisan
router.post('/:id/add-existing-service', protect, addArtisanService);

// Upload images for a specific artisan service
router.post(
  '/:artisanId/service/:serviceId/upload',
  protect,
  upload.array('files', 5),
  uploadServiceImages
);

// ------------------- Nearby Artisans -------------------
router.get('/nearby', findNearbyArtisans);


// ...
router.get('/:artisanId/services', protect, getArtisanServices);

module.exports = router;