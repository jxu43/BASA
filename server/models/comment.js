var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
    commentId: String,
    time: Date,
    replies: [this]
});

var Comment = mongoose.model("comment", CommentSchema);
module.exports = {
    Comment: Comment
}