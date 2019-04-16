var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
    commentId: String,
    time: Date,
    replies: [
        {
            reply: Comment
        }
    ]
});

var Comment = mongoose.model("comment", CommentSchema);
module.exports = {
    Comment: Comment
}