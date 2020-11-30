
const accountModel = require('../models/accountModel');

exports.login = (req, res, next) => {
    res.render('user/login');
};

exports.signup = (req, res, next) => {
    res.render('user/signup');
};