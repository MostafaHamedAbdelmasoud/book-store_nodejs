var express = require('express');
var router = express.Router();
var auth = require('../Http/middleware/auth');

/* GET home page. */
router.get('/',auth.checkAuthenticated,function(req, res, next) {

  res.render('index');
});


/* GET home page. */
router.get('/about',function(req, res, next) {
  res.render('about');
});

module.exports = router;
