var express = require('express')
var db = require('../models')
// var passport = require('../config/ppConfig')
var router = express.Router()

router.get('/', function (req, res) {
  res.render('client/index')
})

module.exports = router
