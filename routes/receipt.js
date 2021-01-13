var express = require('express');
var router = express.Router();
const receiptController = require('../controllers/receiptController');

router.get('/purchase-history', receiptController.index);
router.post('/purchase-history', receiptController.filter);
router.post('/purchase-history/detail', receiptController.detail);

router.get('/purchase-history/detail', (req, res) => {
    res.redirect('/receipt/purchase-history');
});

router.post('/cancel', receiptController.cancel);

module.exports = router;