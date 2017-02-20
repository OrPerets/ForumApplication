var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
    title: String,
    link: String,
    upvotes: {type: Number, default:0},
    // create "Join" for MongoDB
    comments: [{type: mongoose.Schema.Types.ObjectId , ref: 'Comment'}]
});

PostSchema.methods.upvote = function(event) {
    this.upvotes +=1 ;
    this.save(event);
};

mongoose.model('Post', PostSchema);
