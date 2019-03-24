var express = require('express')
var bodyParser = require('body-parser')
var multer = require('multer')
var request = require('request')
var routes = require('./routes')
var session = require('express-session')
var mongoStore = require('connect-mongo')(session);

var upload = multer({dest: 'static/upload/'})

express()
  .use(express.static('static'))
  .use(bodyParser.urlencoded({extended: true}))
  .use(session({resave: false, saveUninitialized: true, secret: process.env.SESSION_SECRET}))
  .use(session({secret: 'Test0123', store: new mongoStore({ url: 'mongodb://localhost:27017/datingapp' })}))
  .set('view engine', 'ejs')
  .set('views', 'view')
  .get('/', routes.home)
  .get('/register', routes.register)
  .post('/loginForm', routes.loginForm)
  .get('/login', routes.login)

  .post('/add', upload.single('profile'), routes.form)
  .get('/:id', routes.profile)
  .delete('/:id', routes.remove)
  .use(notFound)
  .listen(8000)

function notFound(req, res) {
  res.status(404).render('not-found.ejs')
}