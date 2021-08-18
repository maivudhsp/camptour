const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}


module.exports.register = async(req, res, next) => {
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
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back!');
    res.redirect('/camptours');
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', ' Goodbye')
    res.redirect('/camptours');
}
