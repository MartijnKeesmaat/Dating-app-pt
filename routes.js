/* eslint-disable new-cap */
/* eslint-disable require-jsdoc */

// eslint-disable-next-line no-unused-vars
const find = require('array-find');
const mongo = require('mongodb');
// eslint-disable-next-line no-unused-vars
const session = require('express-session');

// setting database
require('dotenv').config();

let db = null;
const url = process.env.MONGODB_URI;

mongo.MongoClient.connect(url, {useNewUrlParser: true}, function(err, client) {
  if (err) throw err;
  db = client.db(process.env.DB_NAME);
});

exports.home = function(req, res, data) {
  // Check value in session variable
  if (!req.session.isAuthenticated) {
    res.redirect('/login');
  } else {
    console.log(req.session.user);
    db.collection('profile').find().toArray(done);
    function done(err, data) {
      res.render('home.ejs', {
        data: data,
        isAuthenticated: req.session.isAuthenticated,
        login: req.session.login,
        user: req.session.user,
        iceBreakerData: {images: []},

      });
    }
  }
};

exports.register = function(req, res) {
  res.render('register.ejs', {isAuthenticated: req.session.isAuthenticated});
};

exports.form = function(req, res) {
  db.collection('profile').insertOne({
    email: req.body.email,
    password: req.body.password,
    profile: req.file ? req.file.filename : null,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    age: Number(req.body.age),
    location: req.body.location,
    bio: req.body.bio,
    genre: req.body.genre,
    instrument: req.body.instrument,
    specialize: req.body.specialize,
    date: Date.parse(Date(Date.now())),
  }, done);

  function done(err, data) {
    if (err) {
      next(err);
    } else {
      const email = req.body.email;
      const password = req.body.password;
      db.collection('profile').findOne({
        email: email,
        password: password,
      }, user);
      function user(err, data) {
        req.session.isAuthenticated = true;
        req.session.user = data;
        login: req.session.login,
        res.redirect('/');
      }
    }
  }
};

exports.profile = function(req, res, next) {
  const id = req.params.id;
  db.collection('profile').findOne({
    _id: mongo.ObjectID(id),
  }, done);

  db.collection('profile').findOne({
    _id: mongo.ObjectID(id),
  }, done);

  function done(err, data) {
    if (err) {
      next(err);
    } else {
      res.render('profile.ejs', {
        data: data,
        isAuthenticated: req.session.isAuthenticated,
        login: req.session.login,
        user: req.session.user

      });
    }
  }
};

exports.login = function(req, res, data) {
  res.render('login.ejs', {
    isAuthenticated: req.session.isAuthenticated,
    login: req.session.login,
  });
};

exports.loginForm = function(req, res) {
  const sess = req.session;
  const email = req.body.email;
  db.collection('profile').findOne({
    email: email,
  }, done);

  function done(err, data) {
    if (data && data.password === req.body.password) {
      req.session.user = data;
      sess.isAuthenticated = true;

      req.session.login = {
        firstname: data.firstname,
        id: data.id,
      };

      res.redirect('/');
    } else {
      sess.isAuthenticated = false;
      req.session.login = {
        firstname: data.firstname,
        id: data.id,
      };
      res.redirect('/login');
    }
  }
};

exports.iceBreaker = function(req, res) {
  const sess = req.session;
  const iceBreakerData = {
    images: {},
  };

  iceBreakerData.images = []; // reset data
  iceBreakerData.images.push(
      `/img/icebreaker/${req.body.q1}.jpg`,
      `/img/icebreaker/${req.body.q2}.jpg`,
      `/img/icebreaker/${req.body.q3}.jpg`
  );
  // console.log(req.session.user);
  // res.render('home', {
  //   // user: req.session.user,
  // });

  if (!req.session.isAuthenticated) {
    res.redirect('/login');
  } else {
    db.collection('profile').find().toArray(done);
    function done(err, data) {
      res.render('home', {
        iceBreakerData,
        data: data,
        isAuthenticated: req.session.isAuthenticated,
        user: req.session.user,
        login: req.session.login,
      });
    }
  }
  // db.collection('profile').findOne({
  //   email: email,
  // }, done);

  // function done(err, data) {
  //   if (data && data.password === req.body.password) {
  //     req.session.user = data;
  //     sess.isAuthenticated = true;
  //     res.redirect('/');
  //   } else {
  //     sess.isAuthenticated = false;
  //   }
  // }
  // res.redirect('/');
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

exports.filter = function(req, res) {
  // In this case switch is better than if else if else if else ... etc
  switch (req.body.sort) {
    case 'age-high-low':
      db.collection('profile').find().sort({age: -1}).toArray(done);
      break;
    case 'age-low-high':
      db.collection('profile').find().sort({age: 1}).toArray(done);
      break;
    case 'new':
      db.collection('profile').find().sort({date: -1}).toArray(done);
      break;
  }
  function done(err, data) {
    res.render('home.ejs', {
      data: data,
      isAuthenticated: req.session.isAuthenticated,
      iceBreakerData: {images: []},
      login: req.session.login,
      user: req.session.user,
    });
  }
};

exports.remove = function(req, res, next) {
  const sess = req.session;
  const id = req.params.id;
  db.collection('profile').deleteOne({
    _id: mongo.ObjectID(id),
  }, done);

  function done(err) {
    if (err) {
      next(err);
    } else {
      // logout
      sess.isAuthenticated = false;
      res.json({status: 'ok'});
    }
  }
};
