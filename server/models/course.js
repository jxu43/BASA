var mongoose = require('mongoose');

var CourseSchema = new mongoose.Schema({
    courseId: {
        type: String,
        unique: true,
        required: true,
    },
    subject: String,
    educatorId: String,
    sections: [
        {
            sectionId: {type: String},
            video: {type: Buffer},
            description: {type: String},
            comments: [{
                comment: Comment
            }]
        }]
})

var Course = mongoose.model("course", CourseSchema)
module.exports = {
    Course: Course
}