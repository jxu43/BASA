var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');


var CommentSchema = new mongoose.Schema({
	userId: String,
    courseId: String,
    sectionId: String,
    commentId: String,
    content: String,
    time: Date,
    replies: [this]
});



CommentSchema.plugin(autoIncrement.plugin, {
    model: 'Comment',
    field: 'commentId',
    startAt: 0,
    incrementBy: 1
});

var Comment = mongoose.model("Comment", CommentSchema);
module.exports = Comment;
