const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

router.post('/', reviewController.addReview);
router.get('/:movieId', reviewController.getReviews);
router.get('/:movieId/average-rating', reviewController.getAverageRating);
router.delete('/:reviewId', reviewController.deleteReview);

module.exports = router;
