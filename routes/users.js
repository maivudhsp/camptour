const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const User = require('../models/user');




router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', catchAsync(async(req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ email, username });
        await User.register(user, password);
        req.flash('success', 'Welcome to Camp tour!');
        res.redirect('/camptours')
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}));


router.get('/login', (req, res) => {
    res.render('users/login');
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'Welcome back!');
    res.redirect('/camptours');
})

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', ' Goodbye')
    res.redirect('/camptours');
})

module.exports = router;