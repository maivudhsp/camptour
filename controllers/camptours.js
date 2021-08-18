const Camptour = require('../models/camptour');



module.exports.index = async (req, res, next) => {
    const camptours = await Camptour.find({});
    res.render('camptours/index', { camptours})
}

module.exports.renderNewForm =  (req, res) => {
    res.render('camptours/new');
}

module.exports.createCamptour = async (req, res) => {

    if (!req.body.camptour) throw new AppError('Invalid camptour Data', 404);
   
    const camptour = new Camptour(req.body.camptour);
    camptour.author = req.user._id;
    await camptour.save();
    console.log(camptour);
    req.flash('success', 'Successfully made a new camptour');
    res.redirect(`/camptours/${camptour._id}`);
}


module.exports.showCamptour = async (req, res) => {
   const camptour = await Camptour.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!camptour) {
        req.flash('error', 'Cannot find that camptour!')
        return res.redirect('/camptours');
    }
    res.render('camptours/show', { camptour })
}

module.exports.renderEditCamptour = async (req, res) => {
    const camptour = await Camptour.findById(req.params.id);
    if (!camptour) {
        req.flash('error', 'Cannot find that camptour!')
        return res.redirect('/camptours');
        //return new AppError('Camptour not found', 404);
    }
    res.render('camptours/edit', { camptour });
};

module.exports.updateCamptour = async (req, res) => {
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
}

module.exports.deleteCamptour =  async (req, res) => {
    const { id } = req.params;
    await Camptour.findByIdAndDelete(id);
    if (!id) {
        req.flash('error', 'Id not found')
    }
    req.flash('success', 'Successfully delete a camptour');
    res.redirect('/camptours');
}