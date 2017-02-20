var express = require('express');
var router = express.Router();
var mongoskin = require('mongoskin');
var db = mongoskin.db('mongodb://localhost:27017/forum');
var ObjectID = require('mongoskin').ObjectID;
var post = require('../models/Posts');
var comment = require('../models/Comments');

router.param('post', function(req, res, next, id) {
  var query = db.collection('system').find(id).then(function(err, post) {
    if (err) return next(err);
    if (!post) return next(new Error('cant find post'));
    req.post = post;
    return next();
  });
});

router.get('/posts/:post', function(req, res) {
  res.json(req.post);
});

router.get('/posts', function(req, res, next) {
  return new Promise(function(fulfill, reject) {
  db.collection('system').find().toArray(function(err, result) {
    if (err) reject(err);
    fulfill();
  })
}).then(res.json(result));

router.post('/posts', function(req, res, next) {
  var newPost = new post(req.body);
  return new Promise(function(fulfill, reject) {
    db.collection('system').insert(newPost, function(err, result) {
    if (err) reject(err);
  })
  }).then(console.log("added"));
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
