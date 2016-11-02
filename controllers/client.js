var express = require('express')
var db = require('../models')
// var passport = require('../config/ppConfig')
var router = express.Router()

var bodyParser = require('body-parser')
router.use(bodyParser.urlencoded({extended: false}))

router.get('/', function (req, res) {
  res.render('client/index')
})

router.get('/manage', function (req, res) {
  db.job.findAll({
    where: {
      clientId: req.user.id,
      $not: {status: 'Cancelled'},
     },
    order: 'id DESC',
    include: [{
      model: db.user,
      as: 'courierDetails',
      attributes: ['name', 'mobile', 'rating','jobQty']
    }]
  }).then(function(jobs) {
    // users will be an array of all User instances
    res.render('client/manage',{jobsCreatedByUser: jobs})
  });
})

router.post('/job/new', function(req, res) {
  db.job.create({
    clientId: req.user.id,
    courierId: null, // to be assigned later
    status: "Pending", // pending, assigned, enroute to pickup, enroute to deliver, completed, cancelled
    itemType: req.body.itemType,
    itemDescription: req.body.itemDescription,
    pickupLatitude: req.body.pickupLatitude,
    pickupLongitude: req.body.pickupLongitude,
    pickupTimeDate: req.body.pickupTimeDate,
    pickupAddress: req.body.pickupAddress,
    pickupPostalCode: req.body.pickupPostalCode,
    pickupCountryId: 1, // assign first
    pickupContactName: req.body.pickupContactName,
    pickupContactNumber: req.body.pickupContactNumber,
    dropoffLatitude: req.body.dropoffLatitude,
    dropoffLongitude: req.body.dropoffLongitude,
    dropoffTimeDate: req.body.dropoffTimeDate,
    dropoffAddress: req.body.dropoffAddress,
    dropoffPostalCode: req.body.dropoffPostalCode,
    dropoffCountryId: 1, // assign first
    dropoffContactName: req.body.dropoffContactName,
    dropoffContactNumber: req.body.dropoffContactNumber,
    courierCurrentLatitude: null, // to be updated when not assigned && not completed
    courierCurrentLongitude: null,
    price: req.body.price
  }).then(function(data) {
    res.redirect('/client/manage')
  // you can now access the newly created task via the variable data
});



});




module.exports = router
