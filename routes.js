
var slug = require('slug')
var find = require('array-find')
var data = [
    {
      id: 'maureen',
      email: 'maureen.jacobs83@example.com',
      password: 'club',
      profile: '1.jpg',
      firstname: 'Maureen',
      lastname: 'Jacobs',
      age: '22'
    },
    {
      id: 'danielle',
      email: 'danielle.turner13@example.com',
      password: 'breanna',
      profile: '2.jpg',
      firstname: 'Danielle',
      lastname: 'Turner',
      age: '26'
    },
    {
      id: 'mario',
      email: 'mario.holt34@example.com',
      password: 'keng',
      profile: '3.jpg',
      firstname: 'Mario',
      lastname: 'Holt',
      age: '24'
    },
    {
      id: 'frank',
      email: 'frank.chapman68@example.com',
      password: 'pumpkins',
      profile: '4.jpg',
      firstname: 'Frank',
      lastname: 'Chapman',
      age: '23'
    },
    {
      id: 'jennie',
      email: 'jennie.nguyen60@example.com',
      password: 'guai',
      profile: '5.jpg',
      firstname: 'Jennie',
      lastname: 'Nguyen',
      age: '22'
    },
    {
      id: 'ronald',
      email: 'ronald.lucas83@example.com',
      password: 'giant',
      profile: '6.jpg',
      firstname: 'Ronald',
      lastname: 'Lucas',
      age: '24'
    },
    {
      id: 'seth',
      email: 'seth.bennett89@example.com',
      password: 'sticky',
      profile: '7.jpg',
      firstname: 'Seth',
      lastname: 'Bennet',
      age: '25'
    },
    {
      id: 'frank',
      email: 'frank.hanson48@example.com',
      password: 'randy1',
      profile: '8.jpg',
      firstname: 'Frank',
      lastname: 'Hanson',
      age: '27'
    },
    {
      id: 'ella',
      email: 'ella.lynch61@example.com',
      password: 'cobain',
      profile: '9.jpg',
      firstname: 'Ella',
      lastname: 'Lynch',
      age: '23'
    },
    {
      id: 'taylor',
      email: 'taylor.gregory70@example.com',
      password: 'bobby1',
      profile: '10.jpg',
      firstname: 'Taylor',
      lastname: 'Gregory',
      age: '28'
    }
]


exports.about = function(req, res) {
    res.render('about.ejs')
}

exports.home = function(req, res) {
    res.render('home.ejs', {data: data})
}

exports.register = function(req, res) {
    res.render('register.ejs')
}

exports.form = function(req, res) {   
    // Zet id gelijk aan name
    var id = slug(req.body.firstname).toLowerCase()

    data.push({
        id: id,
        email: req.body.email,
        password: req.body.password,
        profile: req.file ? req.file.filename : null,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        age: req.body.age
    })

    console.log(data)
    res.redirect('/' + id)
}

exports.profile = function(req, res, next) {
    var id = req.params.id
    var profile = find(data, function (value) {
        return value.id === id
    })

    if (!profile) {
        next()
        return
    }

    res.render('profile.ejs', {data: profile})
}

exports.member = function(req, res) {
    res.render('member.ejs', {data: data})
}

exports.remove = function(req, res) {
    var id = req.params.id

    data = data.filter(function (value) {
        return value.id !== id
    })

    res.json({status: 'ok'})
}