var express = require('express');
var router = express.Router();
const productController = require('../controllers/productController');
const detailController = require('../controllers/detailController');

/*Middleware*/
const ensureAuth = require('../authenticate/ensureAuth');

/* GET home page. */
// router.get('/', productController.getAddProduct);
router.get('/', ensureAuth, productController.index);

router.post('/detail/updateproduct', productController.updateProduct)
router.get('/detail/:id', ensureAuth, detailController.index);
router.get('/addproduct', ensureAuth, productController.getAddProduct);

router.post('/', productController.filter);
router.post('/upload', productController.addProduct);
router.post('/remove', productController.removeProduct);
//router.get('/addproduct', productController.getAddProduct)
router.post('/addproduct', productController.addProduct);

module.exports = router;
