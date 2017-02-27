var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var UserSchema = mongoose.Schema({
    username: {type: String, lowercase: true, unique: true},
    hash: String,
    salt: String //add random string to each password and then hash it
});

UserSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    /*
    using pbkdf2 to hash the password
    the function using 4 parameters:
    password, salt, iteration, key length
    */ 
    this.hash = crypto.pbkdf2Sync(password, this.salt, 100, 64).toString('hex');
};

UserSchema.methods.validPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 100, 64).toString('hex');
    return this.hash === hash;
};

UserSchema.methods.generateJWT = function() {
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    //Returns the JsonWebToken as string
    return jwt.sign({
        _id: this._id,
        username: this.username,
        exp: parseInt(exp.getTime() / 1000),
    }, 'SECRET');
}; //TO-DO: create variables out of the base code

mongoose.model('User', UserSchema);