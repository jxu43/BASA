const express = require('express');
const router = express.Router();
const { hasAuth, needAuth } = require('../config/authenticate');

// Welcome Page
router.get('/', (req, res) => {
	if (req.user) {
		res.render('welcome', {layout: 'navbar', user: req.user, flag: false})
	} else {
		res.render('welcome', {layout: 'navbar', flag: true })
	}
});

// Dashboard
// router.get('/login-home', hasAuth, (req, res) =>
//     res.render('welcome', {
//         user: req.user
//     })
// );

module.exports = router;

