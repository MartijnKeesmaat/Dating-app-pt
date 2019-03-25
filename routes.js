/* eslint-disable new-cap */
/* eslint-disable require-jsdoc */

const find = require('array-find');
const mongo = require('mongodb');
const session = require('express-session');

// setting database
require('dotenv').config();

let db = null;
const url = 'mongodb://' + process.env.DB_HOST + ':' + process.env.DB_PORT;

mongo.MongoClient.connect(url, {useNewUrlParser: true}, function(err, client) {
  if (err) throw err;
  db = client.db(process.env.DB_NAME);
});

exports.home = function(req, res) {
  // Controleer waarde in sessie variable
  if (!req.session.isAuthenticated) {
    res.redirect('/login');
  } else {
    db.collection('profile').find().toArray(done);
    function done(err, data) {
      res.render('home.ejs', {
        data: data,
        isAuthenticated: req.session.isAuthenticated,
      });
    }
  }
};

exports.profile = function(req, res, next) {
  const id = req.params.id;

  db.collection('profile').findOne({
    _id: mongo.ObjectId(id),
  }, done);

  function done(err, data) {
    if (err) {
      next(err);
    } else {
      res.render('profile.ejs', {
        data: data,
        isAuthenticated: req.session.isAuthenticated,
      });
    }
  }
};

exports.register = function(req, res) {
  res.render('register.ejs');
};

exports.form = function(req, res) {
  db.collection('profile').insertOne({
    email: req.body.email,
    password: req.body.password,
    profile: req.file ? req.file.filename : null,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    age: req.body.age,
  }, done);

  function done(err, data) {
    if (err) {
      next(err);
    } else {
      res.redirect('/' + data.insertedId);
    }
  }
};

exports.login = function(req, res) {
  res.render('login.ejs', {isAuthenticated: req.session.isAuthenticated});
};

exports.loginForm = function(req, res) {
  const sess = req.session;
  const email = req.body.email;
  const password = req.body.password;

  if (email === 'ivo@defensemonkees.nl' && password === 'Test0123@!') {
    sess.isAuthenticated = true;
    res.redirect('/');
  } else {
    sess.isAuthenticated = false;
    res.redirect('/login');
  }
};

exports.logout = function(req, res) {
  // source: https://stackoverflow.com/questions/40755622/how-to-use-session-variable-with-nodejs
  req.session.destroy(function(err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/login');
    }
  });
};

exports.remove = function(req, res, next) {
  const id = req.params.id;
  db.collection('profile').deleteOne({
    _id: mongo.ObjectID(id),
  }, done);

  function done(err) {
    if (err) {
      next(err);
    } else {
      res.json({status: 'ok'});
    }
  }
};
