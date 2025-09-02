const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// POST /api/reviews - submit a review
router.post('/', reviewController.createReview);

// GET /api/reviews - get all reviews
router.get('/', reviewController.getReviews);

// GET /api/reviews/artisan/:artisanId - get reviews for specific artisan
router.get('/artisan/:artisanId', reviewController.getReviewsByArtisan);

module.exports = router;