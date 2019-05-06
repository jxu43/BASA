const express = require('express');
const router = express.Router();
// const passport = require('passport');
const Course = require('../models/course');
const Section = require('../models/section');
const Comment = require('../models/comment');
const User = require('../models/user');


const { needAuth, hasAuth, hasPermission} = require('../config/authenticate');

router.get('/catalog', hasAuth, (req, res) => {
    Course.find({}, (err, doc) => {
        if (err) {
            console.log("Failed to retrieve courses");
        }
        var educator = false;
        if (req.user.role == "educator") {
            educator = true;
        }
        res.render('catalog', {layout: 'navbar', user: false, educator: educator, username: req.user.username, doc: doc});
    })
});


router.get('/create', hasPermission, (req, res) => {
    
    var educator = false;
    if (req.user.role == "educator") {
            educator = true;
    }
    console.log(educator)
    res.render('create', {layout: 'navbar', user: false, username: req.user.username, educator: educator})
});


router.post('/create', hasAuth, (req, res) => {
    console.log(req.body);

    const { courseId, courseName, age, description, subject} = req.body;

    let err = [];

    if (!courseId || !courseName || !age || !subject) {
         err.push({ msg: 'Missing Entries' });
    }

    if (err.length > 0) {
         console.log(err);
         res.render('create', {
             err,
         });
    } else {
        Course.findOne({courseId: courseId}).then(course => {
            if (course) {
                err.push({ msg: 'Course Already Exist' });
                res.render('create', {
                    err,
                });
            } else {
                const newCourse = new Course({
                    courseId: courseId,
                    courseName: courseName,
                    age: age,
                    subject: subject,
                    description: req.body.description,
                    educatorId: req.user.userId
                });
                console.log("new course:", newCourse);
                newCourse
                    .save()
                    .then(() => {
                        req.flash(
                            'success_msg',
                            'Course are now created'
                        );
                        console.log("successful save to database");
                        res.redirect('/courses/catalog');
                    })
                    .catch(err => console.log(err));
            }
        })
    }
});

router.get('/:courseId', hasAuth, (req, res) => {

    let courseId = req.params.courseId
    Course.findOne({ courseId: courseId })
        .populate('sections')
        .exec(function(err, course) {
        if (err) {
            console.log("Failed to retrieve sections");
        }

        var educator = false;
        if (req.user.role == "educator") {
            educator = true;
        }
        let join = false;
        if (course.students.includes(req.user.userId)) {
            join = true;
        }
        console.log("get all sections:", course);
        res.render('course', {layout: 'navbar', user: false, username: req.user.username, course: course, educator: educator, join, join});
    })
});


router.post('/:courseId/join',  (req, res) => {
    let courseId = req.params.courseId;
    const userId = req.user.userId;
    Course.findOneAndUpdate({ courseId: courseId }, {$push: {students: userId}}, (err, course) => {
        if (err) {
            console.log("Failed to join a course")
        }
        req.flash(
            'success_msg',
            'Course Joined'
        );
        let section_length = course.sections.length;
        const newCourse = {
            courseId: courseId,
            // progress: Array(section_length).fill(false)
        };
        User.findOneAndUpdate({userId: userId}, {$push: {courses: newCourse }} , {new: true}, (err, doc) => {
            if (err) {
                console.log("Failed to register course");
            }
            let redirect_url = "/courses/" + courseId
            res.redirect(redirect_url);
        })
    })
});




router.get('/:courseId/addSection', hasAuth, (req, res) => {
    res.render('addSection', {layout: 'navbar', user: false, username: req.user.username, courseId: req.params.courseId})
})


router.post('/:courseId/addSection', (req, res) => {

    const { courseId, sectionId, subtitle, video, description } = req.body;

    let err = [];

    if (!sectionId || !courseId) {
        err.push({ msg: 'Missing sectionId' });
    } else{
        const newSection = new Section({
            courseId: courseId,
            sectionId: sectionId,
            subtitle: subtitle,
            video: video,
            description: description,
            comments: []
        });

        
        Course.findOneAndUpdate({courseId: courseId}, {$push: {sections: newSection }} , {new: true})
            .populate('sections')
            .exec(function (err, doc) {
            if (err) {
                console.log("Failed to add sections");
            }
            req.flash(
                'success_msg',
                'Section is now added'
            );
            console.log("successful save to database");
            console.log(doc);

            newSection
                .save()
                .then(() => {
                    res.redirect('/courses/' + courseId);
                })
            //res.redirect('/courses/' + courseId);
        });
    }
});



router.get('/:courseId/:sectionId', (req, res) => {
    let courseId = req.params.courseId;
    let sectionId = req.params.sectionId;
    let nonlast = true;
    let nonfirst = true;
    Section.findOne({ courseId: courseId, sectionId: sectionId})
        .populate('comments')
        .exec(function (err, doc) {

            if (err) {
                console.log("Failed to retrieve sections");
            }
            Course.findOne({courseId: courseId})
            .populate('sections')
            .exec(function(err, course) {
                if (err) {
                    console.log("Failed to retrieve sections");
                }
                let index = course.sections.findIndex(x => x.sectionId === sectionId);
                nonlast = index != (course.sections.length - 1);
                nonfirst = index != 0;
                let kid = req.user.role == "kid";
                res.render('section', {layout: 'navbar', doc: doc, user: false, kid: kid, username: req.user.username, nonlast: nonlast, nonfirst: nonfirst});
            })
        })
});


router.post('/:courseId/:sectionId/last', (req, res) => {
    console.log("entered");
    let courseId = req.params.courseId;
    let sectionId = req.params.sectionId;
    Course.findOne({courseId: courseId})
        .populate('sections')
        .exec(function(err, course) {
            if (err) {
                console.log("Failed to go to the next section")
            }
            let index = course.sections.findIndex(x => x.sectionId ===sectionId);
            // console.log(index);
            let next_section = course.sections[index+1];
            let redirect_url = "/courses/" + courseId + "/" + next_section.sectionId;
            res.redirect(redirect_url)
        
        });
});

router.post('/:courseId/:sectionId/prev', (req, res) => {
    let courseId = req.params.courseId;
    let sectionId = req.params.sectionId;
    Course.findOne({courseId: courseId})
        .populate('sections')
        .exec(function(err, course) {
            if (err) {
                console.log("Failed to go to the previous section")
            }
            let index = course.sections.findIndex(x => x.sectionId ===sectionId);
            // console.log(index);
            let prev_section = course.sections[index-1];
            let redirect_url = "/courses/" + courseId + "/" + prev_section.sectionId;
            res.redirect(redirect_url)

        });
});


router.post('/:courseId/:sectionId/check', (req, res) => {
    let userId = req.user.userId
    let courseId = req.params.courseId;
    let sectionId = req.params.sectionId;
    User.findOneAndUpdate({userId: userId, "courses.courseId": courseId}, {$set: {"courses.$.checked": true}}, (err, user) => {
        if (err) {
            console.log(err);
        } 
        res.redirect("/users/profile");
    })
       
});



router.post('/:courseId/:sectionId/addComment', (req, res) => {
    console.log("entered");
    const { content } = req.body;
    let courseId = req.params.courseId;
    let sectionId = req.params.sectionId;

    req.body.time = new Date();
    let err = [];
    if (!content) {
        err.push({ msg: 'Missing entries' });
    } else{
        const newComment = new Comment({
            userId: req.user.username,
            courseId: courseId,
            sectionId: sectionId,
            content: content,
            time: req.body.time,
            replies: []
        });

        newComment.save(function (err) {
            if (err) return handleError(err);
        });

        Section.findOneAndUpdate({courseId: courseId, sectionId: sectionId}, {$push: {comments: newComment }} , {new: true}, (err, doc) => {
            if (err) {
                console.log("Failed to add comment");
            }
            req.flash(
                'success_msg',
                'Comment is now added'
            );
            //console.log("new comment is", newComment);
            console.log("successful save to database");
            console.log(doc.comments.userId);
            let redirect_url = "/courses/" + courseId + "/" + sectionId;
            res.redirect(redirect_url);
        });
    }
});



router.get('/:courseId/:sectionId/:commentId', (req, res) => {
    const { courseId, sectionId, commentId } = req.body;
    Comment.findOne({ sectionId: sectionId, courseId: courseId, commentId: commentId })
        .exec(function (err, doc) {
            if (err) {
                console.log("Failed to retrieve comments");
            }
            console.log("get comment:", doc);
            res.render('catalog', {layout: 'navbar', doc: doc});
        })
});




router.post('/:courseId/:sectionId/:commentId/addReply', (req, res) => {
    const { reply } = req.body;
    let courseId = req.params.courseId;
    let sectionId = req.params.sectionId;
    let commentId = req.params.commentId;
    let err = [];
    if (!reply) {
        err.push({ msg: 'Missing entries' });
    } else{
        req.body.time = new Date();
        const newComment = new Comment({
            courseId: courseId,
            sectionId: sectionId,
            commentId: commentId,
            content: reply,
            time: req.body.time,
            replies: []
        });

        Comment.findOneAndUpdate({courseId: courseId, sectionId: sectionId, commentId: commentId}, {$push: {replies: newComment }} , {new: true}, (err, doc) => {
            if (err) {
                console.log("Failed to add reply");
            }
            req.flash(
                'success_msg',
                'reply is now added'
            );
            console.log("successful save to database");
            console.log(doc);
            let redirect_url = "/courses/" + courseId + "/" + sectionId;
            res.redirect(redirect_url);
        });
    }
});





module.exports = router;