const express = require('express');
const router = express.Router();
const passport = require('passport');

const User = require('../models/user');
const Course = require('../models/course');
const { needAuth } = require('../config/authenticate');

// Get Login Page
router.get('/login', needAuth, (req, res) => res.render('login', {layout: 'navbar', user: true}));

// Get Register Page
router.get('/register', needAuth, (req, res) => res.render('register', {layout: 'navbar', user: true}));

// Register Route
router.post('/register', (req, res) => {

    console.log(req.body);
    const { email, username, password, repeatPassword, role, parentId, childId } = req.body;

    let err = [];

    if (!username || !email || !password || !repeatPassword || !role) {
        err.push({ msg: 'Missing Entries' });
    }

    if (password != repeatPassword) {
        err.push({ msg: 'Password Mismatch' });
    }

    if (err.length > 0) {
        console.log(err);
        res.render('register', {
            err,
        });
    } else {
        const registerUser = new User({
                                userId: username+password,
                                email: email,
                                username: username,
                                password: password,
                                role: role,
                                parent: parentId,
                                child: childId,
                                courses: []
                            });
        User.register(registerUser, password, function(err, user){
            if(err){
                console.log(err)
                res.render('register', {layout: 'navbar', user: true, message: 'Your registration information is not valid'})
            } else{
                console.log(user)
                passport.authenticate('local')(req, res, function(){
                    console.log("LoggedIn as: ", user.username);
                    res.redirect('/');
                });
            }
        })
    }
});

// Login
router.post('/login', (req, res, next) => {
    console.log("start login auth");
    passport.authenticate('local', function(err, user){
            if(user){
                req.logIn(user, function(error){
                    console.log("LoggedIn as: ", user.username);
                    res.redirect('/');
                });
            } else{
                res.render('login',  {layout: 'navbar', user: true, message:'Your email or password is incorrect.'})
            }
        })(req, res, next);
});

// get profile
router.get('/profile', (req, res) => {

    let userId = req.user.userId;
    let role = req.user.role;
    let name = req.user.username;
    let err = [];

    if (role == 'kid'){
        User.findOne({ userId: userId }, function(err, doc){
            if(err){
                console.log(err);
            } else{
                res.render('profile', {layout: 'navbar', user: false, username: req.user.username, doc: doc, kid: true});
            }
        })
    } else if (role == 'parent'){
        User.findOne({ userId: userId }, function(err, doc1){
            if(err){
                console.log(err);
            } else{
                User.find({parent: name}, function(err, doc2) {
                    res.render('profile', {layout: 'navbar', user: false, username: req.user.username, doc: doc1, kids: doc2, parent: true});
                })
                
            }
        })
    } else if (role == 'educator'){
        User.findOne({ userId: userId }, function(err, doc1){
            if(err){
                console.log(err);
            } else{
                Course.find({ educatorId: userId }, function(err, doc2){
                    if(err){
                        console.log(err);
                    } else{
                        res.render('profile', {layout: 'navbar', user: false, username: req.user.username, courses: doc2, doc: doc1, educator: true});
                    }
                })
            }
        })

    } else{
            err.push({ msg: 'Wrong role' });
            console.log(err);
    }

});



// Logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});

module.exports = router;