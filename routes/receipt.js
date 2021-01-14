var express = require('express');
var router = express.Router();
const receiptController = require('../controllers/receiptController');
/*Middleware*/
const ensureAuth = require('../authenticate/ensureAuth');

router.get('/purchase-history', ensureAuth, receiptController.index);
router.post('/purchase-history', ensureAuth, receiptController.filter);
router.post('/purchase-history/detail', ensureAuth, receiptController.detail);

router.get('/purchase-history/detail', (req, res) => {
    res.redirect('/receipt/purchase-history');
});

router.post('/cancel',ensureAuth, receiptController.cancel);

module.exports = router;