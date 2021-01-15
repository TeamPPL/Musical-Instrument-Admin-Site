const express = require('express');
const router = express.Router();
const passport = require('passport');

/* controllers */
const adminAccountsController = require('../controllers/adminAccountsController');

/*Middleware*/
const ensureAuth = require('../authenticate/ensureAuth');
const ensureSuperAdmin = require('../authenticate/ensureSuperAdmin');

/* GET users listing. */
router.get('/', ensureAuth, adminAccountsController.info);

router.get('/login', adminAccountsController.login);
//Render signup page
router.get('/new-admin', ensureAuth, ensureSuperAdmin, adminAccountsController.getNewAdmin);

//Post login form
router.post('/login', passport.authenticate('local', {
  successRedirect: '../',
  failureRedirect: '/admin/login',
  failureFlash: true,
})
);

router.post('/update', ensureAuth, adminAccountsController.updateAccountInfo);
router.post('/change-password', ensureAuth, adminAccountsController.changePassword);
router.post('/new-admin', ensureAuth, ensureSuperAdmin, adminAccountsController.createNewAccount);
router.post('/new-admin/checkdata', adminAccountsController.checkSignupData);

//Logout
router.get('/logout', ensureAuth, adminAccountsController.logout);

router.post('/lock', ensureAuth, adminAccountsController.lock);
router.post('/unlock', ensureAuth, adminAccountsController.unlock);

router.get('/:id', ensureAuth, adminAccountsController.getUserDetail);

module.exports = router;
