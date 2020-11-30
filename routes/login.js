var express = require('express');
var router = express.Router();

/* GET login page. */
router.get('/', (req, res, next) => {
  //render login page
  res.render('login');
});

module.exports = router;