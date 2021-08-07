const express = require('express');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const router = express.Router();
const { validateCamptour } = require('../utils/middleware');

const Camptour = require('../models/camptour');




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
    req.flash('success', 'Successfully made a new camptour');
    res.redirect(`/camptours/${camptour._id}`);
}));


//get a camptours
router.get('/:id', catchAsync(async (req, res) => {
    const camptour = await Camptour.findById(req.params.id).populate('reviews');
    if (!camptour) {
        req.flash('error', 'Cannot find that camptour!')
        return res.redirect('/camptours');
    }
    res.render('camptours/show', { camptour })
}))

//edit a camptour
router.get('/:id/edit', catchAsync(async (req, res) => {
    const camptour = await Camptour.findById(req.params.id);
    if (!camptour) {
        req.flash('error', 'Cannot find that camptour!')
        return res.redirect('/camptours');
        //return new AppError('Camptour not found', 404);
    }
    res.render('camptours/edit', { camptour });
}))

//update a camptours
router.put('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const camptour = await Camptour.findById(id);
    if (!camptour) {
        req.flash('error', 'Cannot find that camptour!')
        return res.redirect('/camptours');
        //return new AppError('Camptour not found', 404);
    }
    await Camptour.findByIdAndUpdate(id, { ...req.body.camptour });
    req.flash('success', 'Successfully made a update camptour');
    res.redirect(`/camptours/${camptour._id}`);
}))

//delete
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    await Camptour.findByIdAndDelete(id);
    if (!id) {
        req.flash('error', 'Id not found')
    }
    req.flash('success', 'Successfully delete a camptour');
    res.redirect('/camptours');
})

module.exports = router;