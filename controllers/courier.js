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
    }]
  }).then(function(jobs) {
    // users will be an array of all User instances
    console.log("LOOK HERE>>>>>", jobs)
    console.log("LOOK HERE jobs[0].clientDetails>>>>>", jobs[0].clientDetails)
    res.render('courier/index',{jobsAvailable: jobs})
  });
})

module.exports = router
