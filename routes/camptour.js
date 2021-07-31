const express = require('express');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const router = express.Router();


const Camptour = require('../models/Camptour');


//validate camptours
const validateCamptour = (req, res, next) => {   
    const { error } = camptourSchema.validate(req.body);
    if (error) {
        const message = error.details.map(el => el.message).join(',')
        throw new AppError(message, 400)
    } else {
        next();
    }
}


//get all Camptour
router.get('/', catchAsync(async (req, res, next) => {
    const camptours = await Camptour.find({});
    res.render('camptours/index', { camptours})
}));

//get a new camptour
router.get('/new', (req, res) => {
    res.render('camptours/new');
})

//create a camptour
router.post('/',validateCamptour, catchAsync(async (req, res) => {

    if (!req.body.camptour) throw new AppError('Invalid camptour Data', 404);
   
    const camptour = new Camptour(req.body.camptour);
    await camptour.save();
    res.redirect(`/camptours/${camptour._id}`);
}));


//get a camptours
router.get('/:id', catchAsync(async (req, res) => {
    const camptour = await Camptour.findById(req.params.id).populate('reviews');
    console.log(camptour);
    if (!camptour) {
        return new AppError('Camptour not found', 404);
    }
    res.render('camptours/show', { camptour })
}))

//edit a camptour
router.get('/:id/edit', catchAsync(async (req, res) => {
    const camptour = await Camptour.findById(req.params.id);
    if (!camptour) {
        return new AppError('Camptour not found', 404);
    }
    res.render('camptours/edit', { camptour });
}))

//update a camptours
router.put('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const camptour = await Camptour.findByIdAndUpdate(id, { ...req.body.camptour });
    res.redirect(`/camptours/${camptour._id}`);
}))

//delete
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    await Camptour.findByIdAndDelete(id);
    res.redirect('/camptours');
})

module.exports = router;