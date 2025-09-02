const Review = require('../models/Review');

// Create a new review
exports.createReview = async (req, res) => {
  const { name, role, feedback, customerId, artisanId } = req.body;
  if (!feedback || !name) {
    return res.status(400).json({ message: 'Name and feedback are required' });
  }

  try {
    const review = new Review({ name, role, feedback, customerId, artisanId });
    await review.save();
    res.status(201).json({ message: 'Review submitted successfully', review });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to submit review', error: err.message });
  }
};

// Get all reviews
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 }); // latest first
    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch reviews', error: err.message });
  }
};

// Get reviews by artisan
exports.getReviewsByArtisan = async (req, res) => {
  const { artisanId } = req.params;
  try {
    const reviews = await Review.find({ artisanId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch reviews', error: err.message });
  }
};