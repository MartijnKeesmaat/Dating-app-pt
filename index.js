/* eslint-disable semi */

var express = require('express')
var find = require('array-find')
var slug = require('slug')
var bodyParser = require('body-parser')
var multer = require('multer')

var data = [
    {
        name: 'Artemis'
    }
]

express()
  .use(express.static('static'))
  .use(bodyParser.urlencoded({extended: true}))
  .set('view engine', 'ejs')
  .set('views', 'view')
  .get('/', home)
  .get('/login', login)
  .post('/form', form)
  .get('/member', member)
  .get('/about', about)
  .use(notFound)
  .listen(8000)

function home(req, res) {
  res.render('home.ejs')
}

function about(req, res) {
    res.render('about.ejs')
}

function login(req, res) {
  res.render('login-signup.ejs')
}

function form(req, res) {   

    data.push({
        name: req.body.name
    })

    res.redirect('/member')
}

function member(req, res) {
    res.render('member.ejs', {data: data})
}

function notFound(req, res) {
  res.status(404).render('not-found.ejs')
}