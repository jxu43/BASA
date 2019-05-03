const express = require('express');
const router = express.Router();
const { hasAuth, needAuth } = require('../config/authenticate');

// Welcome Page
router.get('/', (req, res) => {
	if (req.user) {
		var educator = false;
	        if (req.user.role == "educator") {
	            educator = true;
    	}
		res.render('welcome', {layout: 'navbar', user: false, username: req.user.username, educator: educator})
	} else {
		res.render('welcome', {layout: 'navbar', user: true})
	}
});

router.get('/about', (req, res) => {
	res.render('about', {layout: 'navbar'})
});

// Dashboard
// router.get('/login-home', hasAuth, (req, res) =>
//     res.render('welcome', {
//         user: req.user
//     })
// );

module.exports = router;

