var express = require('express');
var router = express.Router();
const productController = require('../controllers/productController');
const detailController = require('../controllers/detailController');

/* GET home page. */
router.get('/', productController.getAddProduct);
router.get('/detail/:id', detailController.index);

router.post('/upload', productController.addProduct);
router.post('/remove', productController.removeProduct);
//router.get('/addproduct', productController.getAddProduct)
router.post('/addproduct', productController.addProduct);

module.exports = router;
