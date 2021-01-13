const express = require('express');
const router = express.Router();
const passport = require('passport');

/* controllers */
const accountController = require('../controllers/accountControllers');

/*Middleware*/
const ensureAuth = require('../authenticate/ensureAuth');

/* GET users listing. */
router.get('/', ensureAuth, accountController.index);

router.get('/:id', ensureAuth, accountController.getUserDetail);

router.post('/', ensureAuth, accountController.filter);
router.post('/lock', ensureAuth, accountController.lock);
router.post('/unlock', ensureAuth, accountController.unlock);

module.exports = router;
