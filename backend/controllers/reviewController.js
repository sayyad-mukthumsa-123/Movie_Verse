const Review = require('../models/Review');

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

exports.addReview = async (req, res) => {
  const { movieId, email, rating, reviewText } = req.body;

  if (!movieId || !rating || !reviewText || !email || !isValidEmail(email)) {
    return res.status(400).json({ message: 'All fields are required and email must be valid' });
  }

  if (typeof rating !== 'number' || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be a number between 1 and 5' });
  }

  try {
    const newReview = new Review({ movieId, email, rating: Number(rating), reviewText });
    await newReview.save();
    
    res.status(201).json({ message: 'Review added successfully', review: newReview });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ movieId: req.params.movieId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


exports.getAverageRating = async (req, res) => {
  try {
    const reviews = await Review.find({ movieId: req.params.movieId });

    if (!reviews.length) {
      return res.json({ averageRating: 0 });
    }

    const averageRating = parseFloat((reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1));
    res.json({ averageRating });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required for deletion' });
    }

    if (review.email !== email) {
      return res.status(403).json({ message: 'You can only delete your own reviews' });
    }

    await review.deleteOne();
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
