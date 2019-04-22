const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

const User = require('../models/User');
const { needAuth } = require('../config/authenticate');

// Get Login Page
router.get('/login', needAuth, (req, res) => res.render('login', {layout: 'navbar'}));

// Get Register Page
router.get('/register', needAuth, (req, res) => res.render('register', {layout: 'navbar'}));

// Register Route
router.post('/register', (req, res) => {

    console.log(req.body);
    const { email, username, password, repeatPassword, role, parentId } = req.body;

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
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, (err, hash) => {
                if (err) throw err;
                    const hashedPassword = hash;
                    const userId = username+hashedPassword;
                User.findOne({ userId: userId}).then(user => {
                        if (user) {
                            err.push({ msg: 'Already Register' });
                            res.render('register', {
                                err,
                            });
                        } else {
                            const registerUser = new User({
                                userId: userId,
                                email: email,
                                username: username,
                                password: hashedPassword,
                                role: role,
                                parent: parentId,
                                child: [],
                                courses: []
                            });
                            console.log("registerUser is:",registerUser);
                            registerUser
                                .save()
                                .then(() => {
                                    req.flash(
                                        'success_msg',
                                        'You are now registered and can log in'
                                    );
                                    console.log("successful save to database");
                                    res.redirect('/users/login');
                                })
                                .catch(err => console.log(err));
                        }
                    }
                )
            });
        });
    }
});

// Login
router.post('/login', (req, res, next) => {
    console.log("start login auth");
    passport.authenticate('local', {
        successRedirect: '/login-home',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});

module.exports = router;