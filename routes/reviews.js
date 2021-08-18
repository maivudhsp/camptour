const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const reviews = require('../controllers/reviews');
const Review = require('../models/review');
const Camptour = require('../models/camptour');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../utils/middleware');




//review
router.post('/',isLoggedIn, validateReview, catchAsync(reviews.createReview));


router.delete('/:reviewId',isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));


module.exports = router;

