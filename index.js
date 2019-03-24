/* eslint-disable require-jsdoc */
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const routes = require('./routes');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const upload = multer({dest: 'static/upload/'});

express()
    .use(express.static('static'))
    .use(bodyParser.urlencoded({extended: true}))
    .use(session(
        {
          resave: false,
          saveUninitialized: true,
          secret: process.env.SESSION_SECRET,
        }
    ))
    .use(session({secret: 'Test0123', store: new MongoStore({url: 'mongodb://localhost:27017/datingapp'})}))
    .set('view engine', 'ejs')
    .set('views', 'view')
    .get('/', routes.home)
    .get('/register', routes.register)
    .get('/login', routes.login)
    .post('/login', routes.loginForm)
    .post('/add', upload.single('profile'), routes.form)
    .get('/:id', routes.profile)
    .delete('/:id', routes.remove)
    .use(notFound)
    .listen(8000);

function notFound(req, res) {
  res.status(404).render('not-found.ejs');
}
