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

    res.render('create', {layout: 'navbar', user: false, username: req.user.username, educator: educator})
});


router.post('/create', hasAuth, (req, res) => {

    const { courseId, courseName, age, description, subject, coursePic} = req.body;
    // console.log(req.body);
    //coust { coursePic} = req.body.coursePic;

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
                    educatorId: req.user.userId,
                    educatorName: req.user.username,
                    coursePic: coursePic
                });
                newCourse
                    .save()
                    .then(() => {
                        req.flash(
                            'success_msg',
                            'Course are now created'
                        );
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
        let parent = req.user.role == "parent";
        res.render('course', {layout: 'navbar', user: false, parent: parent, username: req.user.username, course: course, educator: educator, join, join});
    })
});


router.post('/:courseId/join', hasAuth, (req, res) => {
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




router.get('/:courseId/addSection', hasPermission, (req, res) => {
    res.render('addSection', {layout: 'navbar', user: false, username: req.user.username, courseId: req.params.courseId})
})


router.post('/:courseId/addSection', hasPermission, (req, res) => {

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
            newSection
                .save()
                .then(() => {
                    res.redirect('/courses/' + courseId + "/" + sectionId);
                })

        });
    }
});



router.get('/:courseId/:sectionId', hasAuth, (req, res) => {
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


router.post('/:courseId/:sectionId/last', hasAuth, (req, res) => {
    let courseId = req.params.courseId;
    let sectionId = req.params.sectionId;
    Course.findOne({courseId: courseId})
        .populate('sections')
        .exec(function(err, course) {
            if (err) {
                console.log("Failed to go to the next section")
            }
            let index = course.sections.findIndex(x => x.sectionId ===sectionId);
            let next_section = course.sections[index+1];
            let redirect_url = "/courses/" + courseId + "/" + next_section.sectionId;
            res.redirect(redirect_url)
        
        });
});

router.post('/:courseId/:sectionId/prev', hasAuth, (req, res) => {
    let courseId = req.params.courseId;
    let sectionId = req.params.sectionId;
    Course.findOne({courseId: courseId})
        .populate('sections')
        .exec(function(err, course) {
            if (err) {
                console.log("Failed to go to the previous section")
            }
            let index = course.sections.findIndex(x => x.sectionId ===sectionId);
            let prev_section = course.sections[index-1];
            let redirect_url = "/courses/" + courseId + "/" + prev_section.sectionId;
            res.redirect(redirect_url)

        });
});


router.post('/:courseId/:sectionId/check', hasAuth, (req, res) => {
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



router.post('/:courseId/:sectionId/addComment', hasAuth, (req, res) => {
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

            let redirect_url = "/courses/" + courseId + "/" + sectionId;
            res.redirect(redirect_url);
        });
    }
});


router.post('/:courseId/:sectionId/:commentId/addReply', hasAuth, (req, res) => {
    const { reply } = req.body;
    let userId = req.user.username;
    let courseId = req.params.courseId;
    let sectionId = req.params.sectionId;
    let commentId = req.params.commentId;
    let err = [];
    if (!reply) {
        err.push({ msg: 'Missing entries' });
    } else{
        req.body.time = new Date();
        const newComment = new Comment({
            userId: userId,
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
            let redirect_url = "/courses/" + courseId + "/" + sectionId;
            res.redirect(redirect_url);
        });
    }
});





module.exports = router;