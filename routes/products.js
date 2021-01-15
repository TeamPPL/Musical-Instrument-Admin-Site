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
router.get('/updateproduct/:id', ensureAuth, productController.update);


router.post('/', ensureAuth, productController.filter);
router.post('/upload', ensureAuth, productController.addProduct);
router.post('/remove', ensureAuth, productController.removeProduct);
router.post('/addproduct', ensureAuth, productController.addProduct);

module.exports = router;
