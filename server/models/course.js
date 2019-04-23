var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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
            section:{
                type: Schema.Types.ObjectId,
                ref: "Section"
            }
        }]
})

var Course = mongoose.model("Course", CourseSchema);
module.exports = Course;