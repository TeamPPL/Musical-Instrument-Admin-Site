var express = require('express');
var router = express.Router();
const productController = require('../controllers/productController');
const detailController = require('../controllers/detailController');

/* GET home page. */
router.get('/', productController.index);
router.get('/detail/:id', detailController.index);
router.post('/upload', productController.addProduct);

module.exports = router;
