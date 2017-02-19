var express = require('express');
var router = express.Router();
var mongoskin = require('mongoskin');
var db = mongoskin.db('mongodb://localhost/forum');
var ObjectID = require('mongoskin').ObjectID;
var post = require('../models/Post');
var comment = require('../models/Comment');

router.get('/posts', function(req, res, next) {
  db.collection('system').find().toArray(function(err, posts) {
    if (err) return next(err);
  });
  res.json(posts);
});

router.post('/posts', function(req, res, next) {
  var newPost = new post(req.body);
  db.collection('system').insert(newPost, function(err){
    if (err) return next(err);
  res.json(newPost);
  });
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
