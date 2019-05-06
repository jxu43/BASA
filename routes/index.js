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
	let bl = true;
	let educator = false;
	if (req.user) {
		bl = false;
		if (req.user.role == "educator") {
	            educator = true;
    	}
    	res.render('about', {layout: 'navbar', user: bl, educator: educator, username: req.user.username})
	} else {
		res.render('about', {layout: 'navbar', user: bl});
	}
	
});


module.exports = router;

