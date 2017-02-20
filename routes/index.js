var express = require('express');
var router = express.Router();
var mongoskin = require('mongoskin');
var db = mongoskin.db('mongodb://localhost:27017/forum');
db.bind('system', {});
var ObjectID = require('mongoskin').ObjectID;
var post = require('../models/Posts');
var comment = require('../models/Comments');
var Promise = require("bluebird");

router.get('/posts/:post', function(req, res) {
  res.json(req.post);
});

router.get('/posts', function(req, res, next) {
  return Promise.try(function() {
    db.collection('system').find().toArray(function(err, result) {
    if (err) return next(err);
  });
}).then(function(result){
  console.log("success");
  res.json(result);
});
});

router.post('/posts', function(req, res, next) {
  var newPost = new post(req.body);
  return Promise.try(function(){
    db.collection('system').insert(newPost, function(err, result) {
      if (err) return next(err);
    });
  }).then(function(result) {
    if (result) console.log("added to DB");
  });
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router


