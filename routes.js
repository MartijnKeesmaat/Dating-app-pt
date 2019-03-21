
var slug = require('slug')
var find = require('array-find')
var mongo = require('mongodb')

// setting database
require('dotenv').config()

var db = null
var url = 'mongodb://' + process.env.DB_HOST + ':' + process.env.DB_PORT

mongo.MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
  if (err) throw err
  db = client.db(process.env.DB_NAME)
})

exports.home = function(req, res, next) {
    db.collection('profile').find().toArray(done)
  
    function done(err, data) {
      if (err) {
        next(err)
      } else {
        res.render('home.ejs', {data: data})
      }
    }
  }

exports.profile = function(req, res, next) {
    var id = req.params.id

    db.collection('profile').findOne({
        _id: mongo.ObjectId(id)
    }, done)

    function done(err, data) {
        if (err) {
        next(err)
        } else {
        res.render('profile.ejs', {data: data})
        }
    }
}

exports.form = function(req, res) {   
    db.collection('profile').insertOne({
      email: req.body.email,
      password: req.body.password,
      profile: req.file ? req.file.filename : null,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      age: req.body.age
    }, done)
  
    function done(err, data) {
      if (err) {
        next(err)
      } else {
        res.redirect('/' + data.insertedId)
      }
    }
}

exports.register = function(req, res) {
    res.render('register.ejs')
}

exports.member = function(req, res) {
    res.render('member.ejs', {data: data})
}

exports.remove = function(req, res, next) {
    var id = req.params.id;
    db.collection("profile").deleteOne({
        _id: mongo.ObjectID(id)
    }, done);
    
    function done(err) {
        if (err) {
            next(err);
        } else {
            res.json({status: "ok"})
        }
    }
}