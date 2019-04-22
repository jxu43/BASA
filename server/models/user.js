var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

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
    child: [{
        childId: String
    }],
    courses: [{
        courseId: String,
        grade: String,
        progress: [{
            checked: Boolean
        }]
    }]
});

var User = mongoose.model('User', UserSchema);
module.exports = User;