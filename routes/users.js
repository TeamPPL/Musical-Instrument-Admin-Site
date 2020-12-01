var express = require('express');
var router = express.Router();

/* controllers */
const accountController = require('../controllers/accountControllers');

/* GET users listing. */
router.get('/', accountController.index);

router.get('/login', accountController.login);
router.get('/signup', accountController.signup);

router.post('/remove', accountController.remove)

module.exports = router;
