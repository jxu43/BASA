const express = require('express');
const router = express.Router();
const passport = require('passport');

const User = require('../models/User');
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

// Logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});

module.exports = router;