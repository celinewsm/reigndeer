var express = require('express')
var bodyParser = require('body-parser')
var ejsLayouts = require('express-ejs-layouts')
var morgan = require('morgan')
var db = require('./models')
var app = express()
var session = require('express-session')
var passport = require('./config/ppConfig')
var isLoggedIn = require('./middleware/isLoggedIn')

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
// app.use('/user', isLoggedIn, require('./controllers/user'))

app.get('/', isLoggedIn, function (req, res) {
  res.render('index')
})


// app.get('/', isLoggedIn, function (req, res) {
//   res.redirect('/user/')
// })

var server = app.listen(process.env.PORT || 3000)

module.exports = server
