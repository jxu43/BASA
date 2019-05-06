var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SectionSchema = new mongoose.Schema({
    courseId: {type: String},
    sectionId: {type: String},
    subtitle: {type: String},
    video: {type: String, unique: false},
    description: {type: String},
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

var Section = mongoose.model("Section", SectionSchema);
module.exports = Section;