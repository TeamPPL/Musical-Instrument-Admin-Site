var express = require('express');
var router = express.Router();
const checkoutController = require('../controllers/checkoutController');

router.get('/cart', checkoutController.cart);
router.post('/cart', (req, res) => {
    const a = req.body.quantity;
    console.log(a);
    res.render('checkout/cart');
  });

module.exports = router;