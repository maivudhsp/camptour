const express = require('express');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const router = express.Router();




//review
router.post('/camptours/:id/reviews',validateReview, catchAsync(async (req, res) => {
    const camptour = await Camptour.findById(req.params.id);
    const review = new Review(req.body.review);
    camptour.reviews.push(review);
    await review.save();
    await camptour.save();
    res.redirect(`/camptours/${camptour._id}`);
}))


router.delete('/camptours/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Camptour.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/camptours/${id}`);
}));


module.exports = router;

