var express = require('express');
var router = express.Router();
var auth = require('../Http/middleware/auth');
const passport = require('passport')

/* GET home page. */
router.get('/register',auth.checkNotAuthenticated, function(req, res, next) {

  res.render('register');
});

router.post('/register', passport.authenticate('local-signup', {
  failureRedirect : '/register',
  failureFlash : true // allow flash messages
}), function(req, res, next)  {
  res.redirect('/')
});

// Login ====================================================================
router.get('/login', function(req, res, next)  {
  if (req.user) {
    res.redirect('/')
  } else {
    res.render('login')
  }
})

router.post('/login', passport.authenticate('local-login', {
  failureRedirect : '/login',
  failureFlash : true // allow flash messages
}), function(req, res, next)  {
  res.redirect('/')
});


// LOGOUT ==============================
router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/login');
});


module.exports = router;
