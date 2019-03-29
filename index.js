/* eslint-disable require-jsdoc */
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const routes = require('./routes');
const session = require('express-session');

const upload = multer({dest: 'static/upload/'});

express()
    .use(express.static('static'))
    .use(bodyParser.urlencoded({extended: true}))
    .use(session({
      resave: false,
      saveUninitialized: true,
      secret: process.env.SESSION_SECRET,
    }))
    .use(session({secret: 'Test0123'}))
    .set('view engine', 'ejs')
    .set('views', 'view')
    .get('/', routes.home)
    .get('/register', routes.register)
    .post('/loginForm', routes.loginForm)
    .get('/login', routes.login)
    .get('/logout', routes.logout)
    .post('/filter', routes.filter)
    .post('/add', upload.single('profile'), routes.form)
    .use(notFound)
    .get('/:id', routes.profile)
    .delete('/:id', routes.remove)
    .listen(process.env.PORT || 8000);

function notFound(req, res) {
  res.status(404).render('not-found.ejs', {
    isAuthenticated: req.session.isAuthenticated,
  });
};
