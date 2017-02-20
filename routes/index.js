var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
var Promise = require("bluebird");

/**
 * all Posts routes 
 */

//automatically load an object
router.param('post', function(req, res, next, id) {
  //query interface - if an error occurs executing the query, 
  var query = Post.findById(id);
  query.exec(function(err, post) {
    if (err) return next(err);
    if (!post) {
      return next(new Error('cant find post'));
    }
    req.post = post;
    return next();
  });
});

router.get('/posts', function(req, res, next) {
  Post.find(function(err, posts) {
    if (err) return next(err); //if and error occurred, we pass the error to an error handling function 
    res.json(posts);
  });
});

router.post('/posts', function(req, res, next) {
  var post = new Post(req.body);
  post.save(function(err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

router.get('posts/:post', function(req, res) {
  res.json(req.post);
});

router.put('/posts/:post/upvote', function(req, res, next){
  req.post.upvote(function(err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/**
 * all Comments routes 
 */

// Preload comment objects on routes with ':comment'
router.param('comment', function(req, res, next, id) {
  var query = Comment.findById(id);

  query.exec(function (err, comment){
    if (err) { return next(err); }
    if (!comment) { 
      return next(new Error('cant find comment'));
    }
    req.comment = comment;
    return next();
  });
});

router.post('/posts/:post/comments', function(req, res, next){
  var comment = new Comment(req.body);
  comment.post = req.post;
  comment.save(function(err, comment){
    if (err) return next(err);
    req.post.comments.push(comment);
    req.post.save(function(err, post){
      if (err) return next(err);
      res.json(comment);
    });
  });
});

router.post('/posts/:post/comments/:comment/upvote', function(req, res, next){
  req.comment.upvote(function(err, comment){
    if (err) return next(err);
    res.json(comment);
  });
});

// populate() returns promise instance
router.get('/posts/:post', function(req, res, next) {
  req.post.populate('comments', function(err, post) {
    if (err) { return next(err); }

    res.json(post);
  });
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router


