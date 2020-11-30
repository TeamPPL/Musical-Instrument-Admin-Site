var express = require('express');
var router = express.Router();
const homeCarouselController = require('../controllers/homeCarouselController');

/* GET home page. */
router.get('/', homeCarouselController.index);

module.exports = router;