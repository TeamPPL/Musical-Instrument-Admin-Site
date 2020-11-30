var express = require('express');
var router = express.Router();

/* controllers */
const userController = require('../controllers/userControllers');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login', userController.login);
router.get('/signup', userController.signup);

module.exports = router;
