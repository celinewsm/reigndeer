var express = require('express')
var db = require('../models')
var passport = require('../config/ppConfig')
var router = express.Router()

router.get('/', function (req, res) {
  res.render('auth/index')
})

router.get('/signup', function (req, res) {
  res.render('auth/signup')
})

router.post('/signup', function(req, res) {
  // find or create a user, providing the name and password as default values
  db.user.findOrCreate({
    where: { email: req.body.email },
    defaults: {
      name: req.body.name,
      password: req.body.password,
      mobile: req.body.mobile,
      type: req.body.type,
      rating: null,
      jobQty: null
    }
  }).spread(function(user, created) {
    if (created) {
      // replace the contents of this if statement with the code below
      passport.authenticate('local', {
        successRedirect: '/'
      })(req, res);
    } else {
      console.log('Email already exists');
      res.redirect('/auth/signup');
    }
  }).catch(function(error) {
    console.log('An error occurred: ', error.message);
    res.redirect('/auth/signup');
  });
});

router.get('/login', function (req, res) {
  res.render('auth/login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth/login'
}));


router.get('/logout', function(req, res) {
  req.logout();
  console.log('logged out');
  res.redirect('/');
});

module.exports = router
