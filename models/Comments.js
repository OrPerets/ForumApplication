var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema ({
    body: String,
    author: String,
    upvotes: {type: Number, default:0},
    //create relationships between post & comment
    post: {type: mongoose.Schema.Types.ObjectId, ref: 'Post'}
});

CommentSchema.methods.upvote = function(event) {
  this.upvotes += 1;
  this.save(event);
};

mongoose.model('Comment', CommentSchema);