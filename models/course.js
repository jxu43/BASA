var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CourseSchema = new mongoose.Schema({
    courseId: {
        type: String,
        unique: true,
        required: true,
    },
    courseName: {
        type: String,
        required: true,
    },
    coursePic: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    age: {
        type: String,
        required: true,
    },
    educatorId: {
        type: String,
        required: true,
    },
    educatorName: {
        type: String,
        required: true,
    },
    description: String,
    sections: [
        {
            type: Schema.Types.ObjectId,
            ref: "Section"
        }
    ], 
    students: []
})

var Course = mongoose.model("Course", CourseSchema);
module.exports = Course;