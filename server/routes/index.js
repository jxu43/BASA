const express = require('express');
const router = express.Router();
const { hasAuth, needAuth } = require('../config/authenticate');

// Welcome Page
router.get('/', needAuth, (req, res) => res.render('welcome'));

// Dashboard
router.get('/login-home', hasAuth, (req, res) =>
    res.render('login-home', {
        user: req.user
    })
);

module.exports = router;

