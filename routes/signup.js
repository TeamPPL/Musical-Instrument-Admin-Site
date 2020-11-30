var express = require('express');
var router = express.Router();

/* GET login page. */
router.get('/', (req, res, next) => {
  //render signup page
  res.render('signup');
});

module.exports = router;