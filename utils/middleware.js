const catchAsync = require('../utils/catchAsync');
const Camptour = require('../models/camptour');
const Review = require('../models/review');
const { camptourSchema, reviewSchema } = require('../schema');

//validate camptours
module.exports.validateCamptour = (req, res, next) => {   
    const { error } = camptourSchema.validate(req.body);
    if (error) {
        const message = error.details.map(el => el.message).join(',')
        throw new AppError(message, 400)
    } else {
        next();
    }
}


module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
     if (error) {
        const message = error.details.map(el => el.message).join(',')
        throw new AppError(message, 400)
    } else {
        next();
    }
}

 module.exports.isLoggedIn = (req, res, next) => {
     if (!req.isAuthenticated()) {
         console.log(req.path, req.originalUrl);
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
     next();
}

module.exports.isAuthor = async (req, res, next) => {

    const { id } = req.params;
    const camptour = await Camptour.findById(id);
    if (!camptour.author.equals(req.user._id)) {
        req.flash('error', 'you do not permission to do that');
        return res.redirect(`/camptours/${id}`);
    }
    next()

}

module.exports.isReviewAuthor = async (req, res, next) => {

    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'you do not permission to do that');
        return res.redirect(`/camptours/${id}`);
    }
    next()

}
