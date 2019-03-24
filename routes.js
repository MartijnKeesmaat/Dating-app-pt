/* eslint-disable new-cap */
/* eslint-disable require-jsdoc */

const mongo = require('mongodb');

// setting database
require('dotenv').config();

let db = null;
const url = 'mongodb://' + process.env.DB_HOST + ':' + process.env.DB_PORT;

mongo.MongoClient.connect(url, {useNewUrlParser: true}, function(err, client) {
  if (err) throw err;
  db = client.db(process.env.DB_NAME);
});

exports.home = function(req, res, next) {
  db.collection('profile').find().toArray(done);

  function done(err, data) {
    res.render('home.ejs', {data: data});
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
      res.render('profile.ejs', {data: data});
    }
  }
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

exports.loginForm = function(req, res, next) {
  res.redirect('/');
};

exports.filter = function(req, res, next) {
  // In this case switch is better than if else if else if else ... etc
  switch (req.body.sort) {
    case 'distance':
      console.log(req.body.sort);
      break;
    case 'age-high-low':
      db.collection('profile').find().sort({age: -1}).toArray(done);
      break;
    case 'age-low-high':
      db.collection('profile').find().sort({age: 1}).toArray(done);
      break;
    case 'new':
      console.log(req.body.sort);
      break;
  }
  function done(err, data) {
    res.render('home.ejs', {data: data});
  }
};

exports.register = function(req, res) {
  res.render('register.ejs');
};

exports.login = function(req, res) {
  res.render('login.ejs');
};

exports.member = function(req, res) {
  res.render('member.ejs', {data: data});
};

exports.remove = function(req, res, next) {
  const id = req.params.id;
  db.collection('profile').deleteOne({
    _id: mongo.ObjectId(id),
  }, done);

  function done(err) {
    if (err) {
      next(err);
    } else {
      res.json({status: 'ok'});
    }
  }
};
