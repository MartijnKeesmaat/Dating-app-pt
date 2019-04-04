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

exports.home = function(req, res) {
	// Check value in session variable
	if (!req.session.isAuthenticated) {
		res.redirect('/login');
	} else {
		db.collection('profile').find().toArray(done);
		function done(err, data) {
			res.render('home.ejs', {
				data: data,
				isAuthenticated: req.session.isAuthenticated,
				login: req.session.login
			});
		}
	}
};

exports.profile = function(req, res, next) {
	const id = req.params.id;

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
		date: Date.parse(Date(Date.now())),
	}, done);

	function done(err, data) {
		if (err) {
			next(err);
		} else {


			res.redirect('/' + data.insertedId);
		}
	}
}

exports.login = function(req, res) {
	res.render('login.ejs', {isAuthenticated: req.session.isAuthenticated});
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
        firstname: data.firstname
      }

			res.redirect('/');


		} else {
			sess.isAuthenticated = false;
			res.redirect('/login');

		}
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
		});
	}
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
