var express = require('express')
var db = require('../models')
// var passport = require('../config/ppConfig')
var router = express.Router()

router.get('/', function (req, res) {
  db.job.findAll({
    where: {
      status: "Pending"
     },
    order: 'id DESC',
    include: [{
      model: db.user,
      as: 'clientDetails',
      attributes: ['name', 'mobile', 'rating','jobQty']
    },{
      model: db.itemCategory,
      as: 'itemCategory',
      attributes: ['name']
    }]
  }).then(function(jobs) {
    // users will be an array of all User instances
    res.render('courier/index',{jobsAvailable: jobs})
  });
})


router.get('/manage', function (req, res) {
  db.job.findAll({
    where: {
      courierId: req.user.id,
      $not: {status: 'Cancelled'},
      $not: {status: 'Archived'},
      // $not: {status: 'Delivered'},
     },
    order: 'id DESC',
    include: [{
      model: db.user,
      as: 'clientDetails',
      attributes: ['name', 'mobile', 'rating','jobQty']
    },{
      model: db.itemCategory,
      as: 'itemCategory',
      attributes: ['name']
    }]
  }).then(function(jobs) {
    // users will be an array of all User instances
    res.render('courier/manage',{jobsAccepted: jobs})
  });
})


module.exports = router
