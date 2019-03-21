/* eslint-disable semi */

var express = require('express')
var bodyParser = require('body-parser')
var multer = require('multer')
var request = require('request')
var routes = require('./routes')

var upload = multer({dest: 'static/upload/'})

express()
  .use(express.static('static'))
  .use(bodyParser.urlencoded({extended: true}))
  .set('view engine', 'ejs')
  .set('views', 'view')
  .get('/', routes.home)
  .get('/register', routes.register)
  .post('/add', upload.single('profile'), routes.form)
  .get('/:id', routes.profile)
  .delete('/:id', routes.remove)
  .use(notFound)
  .listen(8000)

function notFound(req, res) {
  res.status(404).render('not-found.ejs')
}