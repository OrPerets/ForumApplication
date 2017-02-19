var mongoskin = require('mongoskin');
var ObjectID = require('mongoskin').ObjectID;
var db = mongoskin.db('mongodb://localhost/forum', {safe:false});
db.bind('system', {});

var Comment = {
    title: String,
    link: String,
    upvotes: {type: Number, default:0},
    post: {type: ObjectID, ref: 'Post'}
};
