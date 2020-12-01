
const accountModel = require('../models/accountModel');

exports.index = async (req, res, next) => {
    const accountListItems = await accountModel.list();
    console.log(accountListItems);
    res.render('user/accountList', {accountListItems})
}

exports.login = (req, res, next) => {
    res.render('user/login');
};

exports.signup = (req, res, next) => {
    res.render('user/signup');
};

exports.remove = async (req, res, next) => {
    let id = req.body.id;
    console.log(id);
    const result = await accountModel.removeOne(id);

    console.log(result.deletedCount);

    if (result.deletedCount === 0)
      res.send("Remove failed!");
    else
      res.redirect(req.get('referer'));
}