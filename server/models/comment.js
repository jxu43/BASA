var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
    courseId: String,
    sectionId: String,
    commentId: String,
    content: String,
    time: Date,
    replies: [this]
});

var Comment = mongoose.model("Comment", CommentSchema);
module.exports = Comment;
