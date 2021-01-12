const express = require('express');
const router = express.Router();
const passport = require('passport');

/* controllers */
const accountController = require('../controllers/accountControllers');

/*Middleware*/
const ensureAuth = require('../authenticate/ensureAuth');

/* GET users listing. */
router.get('/', ensureAuth, accountController.index);

router.post('/', accountController.filter);
router.post('/lock', accountController.lock);
router.post('/unlock', accountController.unlock);

module.exports = router;
