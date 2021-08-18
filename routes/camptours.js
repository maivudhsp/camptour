const express = require('express');
const router = express.Router();
const camptours = require('../controllers/camptours');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateCamptour, isAuthor } = require('../utils/middleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' })



router.route('/')
    .get(catchAsync(camptours.index))
    .post(upload.single('image'),catchAsync(camptours.createCamptour))
    //.post(isLoggedIn, validateCamptour, catchAsync(camptours.createCamptour));

router.get('/new', isLoggedIn,camptours.renderNewForm);

router.route('/:id')
    .get(isLoggedIn, catchAsync(camptours.showCamptour))
    .put(isLoggedIn, isAuthor, catchAsync(camptours.updateCamptour))
    .delete(isLoggedIn,isAuthor, camptours.deleteCamptour);

router.get('/:id/edit', isLoggedIn,isAuthor, catchAsync(camptours.renderEditCamptour));



module.exports = router;