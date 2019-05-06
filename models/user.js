var mongoose = require('mongoose');
// var bcrypt = require('bcrypt');
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
    userId: {
        type: String,
        unique: true,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    parent: String,
    courses: [{
        courseId: String,
        checked: Boolean
    }]
});
UserSchema.plugin(passportLocalMongoose);
var User = mongoose.model('User', UserSchema);
module.exports = User;