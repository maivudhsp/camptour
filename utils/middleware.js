const catchAsync = require('../utils/catchAsync');
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
