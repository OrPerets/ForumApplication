var mongoskin = require('mongoskin');
var ObjectID = require('mongoskin').ObjectID;
var db = mongoskin.db('mongodb://localhost/forum', {safe:false});
db.bind('system', {});

var Post = {
    title: String,
    link: String,
    upvotes: {type: Number, default:0},
    comments: [{type: ObjectID, ref: 'Comment'}]
};

