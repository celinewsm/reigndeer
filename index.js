var express = require('express')
var bodyParser = require('body-parser')
var ejsLayouts = require('express-ejs-layouts')
var morgan = require('morgan')
var db = require('./models')
var app = express()
var session = require('express-session')
var passport = require('./config/ppConfig')
var isLoggedIn = require('./middleware/isLoggedIn')
var server = require('http').createServer(app);
var io = require('socket.io')(server);

// var userType = require('./middleware/userType')

var port = process.env.PORT || 3000;
server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

app.set('view engine', 'ejs')
app.use(require('morgan')('dev'))
app.use(ejsLayouts)
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(__dirname + '/static/'))

app.use(session({
  secret: process.env.SESSION_SECRET || 'secret message',
  resave: false,
  saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(function (req, res, next) {
  res.locals.currentUser = req.user
  next()
})

app.use('/auth', require('./controllers/auth'))
app.use('/client', isLoggedIn, require('./controllers/client'))
app.use('/courier', isLoggedIn, require('./controllers/courier'))

// app.use('/user', isLoggedIn, require('./controllers/user'))

app.get('/', isLoggedIn, function (req, res) {
  // this one should be unnecessary
  // res.render('index')
  if (req.user.type === "client") {
    res.redirect('/client/');
  } else if (req.user.type === "courier") {
    res.redirect('/courier/')
  } else {
    // this one should be unnecessary
    res.redirect('/auth/login')
  }
})


io.on('connection', function (socket) {
  // socket.join('Lobby')
  console.log("connected")

  socket.on('disconnect', function () {
    console.log("disconnected")
  });

  socket.on('client updates job', function(updatedJob){
    db.job.update({
      pickupContactNumber: updatedJob.pickupContactNumber,
      pickupContactName: updatedJob.pickupContactName,
      dropoffContactNumber: updatedJob.dropoffContactNumber,
      dropoffContactName: updatedJob.dropoffContactName,
    }, {
      where: {
        id: updatedJob.id
      }
    }).then(function() {
      db.job.find({
        where: {
          id: updatedJob.id
         },
        include: [{
          model: db.user,
          as: 'courierDetails',
          attributes: ['name', 'mobile', 'rating','jobQty']
        }]
      }).then(function(job) {
        socket.broadcast.emit('update courier on job update', job);
      });
    });
  });

  socket.on('client cancels job', function(jobId){
    db.job.update({
      status: "Cancelled"
    }, {
      where: {
        id: jobId
      }
    }).then(function(job) {
      console.log("newly updated job",job)
      // socket.broadcast.to(updatedJob.id).emit('update courier on job update', job);
    });
  });


  socket.on('client join channels', function(userId){
    db.job.findAll({
      where: {
        clientId: userId,
        $not: {status: 'Cancelled'},
       },
    }).then(function(jobs) {
      // users will be an array of all User instances
      for (var i = 0 ; i < jobs.length ; i++){
        console.log("joining room")
        socket.join(jobs[i].id)
      }
    });
  });

  socket.on('courier join channels', function(userId){
    db.job.findAll({
      where: {
        courierId: userId,
        $not: {status: 'Cancelled'},
        $not: {status: 'Completed'},
       },
    }).then(function(jobs) {
      // users will be an array of all User instances
      for (var i = 0 ; i < jobs.length ; i++){
        console.log("joining room")
        socket.join(jobs[i].id)
      }
    });
  });

  socket.on('courier accepts job', function(data){
    db.job.update({
      status: "Accepted",
      courierId: data.courierId
    }, {
      where: {
        id: data.jobId
      }
    }).then(function() {

      db.job.find({
        where: {
          id: data.jobId
         },
        include: [{
          model: db.user,
          as: 'courierDetails',
          attributes: ['name', 'mobile', 'rating','jobQty']
        }]
      }).then(function(job) {
        socket.broadcast.to(data.jobId).emit('courier accepted client job', job);
      });
    });
  })

  socket.on('update courier position', function(data){
    console.log("update courier position triggered")
    db.job.update({
      status: data.status,
      courierCurrentLatitude: data.courierCurrentLatitude,
      courierCurrentLongitude: data.courierCurrentLongitude,
    }, {
      where: {
        id: data.jobId
      }
    }).then(function() {

      db.job.find({
        where: {
          id: data.jobId
         },
        include: [{
          model: db.user,
          as: 'courierDetails',
          attributes: ['name', 'mobile', 'rating','jobQty']
        }]
      }).then(function(job) {
        socket.broadcast.to(data.jobId).emit('courier updated status and/or position', job);
      });
    });
  })

  socket.on('pause courier activity', function(data){
    console.log("pause courier activity triggered")
    db.job.update({
      status: data.status,
      courierCurrentLatitude: null,
      courierCurrentLongitude: null,
    }, {
      where: {
        id: data.jobId
      }
    }).then(function() {
      db.job.find({
        where: {
          id: data.jobId
         },
        include: [{
          model: db.user,
          as: 'courierDetails',
          attributes: ['name', 'mobile', 'rating','jobQty']
        }]
      }).then(function(job) {
        socket.broadcast.to(data.jobId).emit('courier updated status and/or position', job);
      });
    });
  })




});





// module.exports = server
