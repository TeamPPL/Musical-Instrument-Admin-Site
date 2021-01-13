const express = require('express');
const router = express.Router();
const passport = require('passport');

/* controllers */
const adminAccountsController = require('../controllers/adminAccountsController');

/*Middleware*/
const ensureAuth = require('../authenticate/ensureAuth');

/* GET users listing. */
router.get('/', adminAccountsController.info);

router.get('/login', adminAccountsController.login);
//Render signup page
router.get('/new-admin', ensureAuth, adminAccountsController.getNewAdmin);

//Post login form
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/user/login',
  failureFlash: true
})
);

router.post('/update', ensureAuth, adminAccountsController.updateAccountInfo);
router.post('/change-password', ensureAuth, adminAccountsController.changePassword);
router.post('/new-admin', adminAccountsController.createNewAccount);
router.post('/new-admin/checkdata', adminAccountsController.checkSignupData);

module.exports = router;
