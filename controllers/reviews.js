const Camptour = require('../models/camptour');
const Review = require('../models/review');


module.exports.createReview = async (req, res) => {
    const camptour = await Camptour.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    camptour.reviews.push(review);
    await review.save();
    await camptour.save();
    req.flash('success', 'Successfully made a new Review!')
    res.redirect(`/camptours/${camptour._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Camptour.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
     req.flash('success', 'Successfully delete a Review!')
    res.redirect(`/camptours/${id}`);
}