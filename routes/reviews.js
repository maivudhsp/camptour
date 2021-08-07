const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const Review = require('../models/review');
const Camptour = require('../models/camptour');
const { validateReview } = require('../utils/middleware');




//review
router.post('/',validateReview, catchAsync(async (req, res) => {
    const camptour = await Camptour.findById(req.params.id);
    const review = new Review(req.body.review);
    camptour.reviews.push(review);
    await review.save();
    await camptour.save();
    req.flash('success', 'Successfully made a new Review!')
    res.redirect(`/camptours/${camptour._id}`);
}))


router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Camptour.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
     req.flash('success', 'Successfully delete a Review!')
    res.redirect(`/camptours/${id}`);
}));


module.exports = router;

