module.exports = {
    hasAuth: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('error_msg', 'Please log in to view that resource');
        res.redirect('/users/login');
    },
    needAuth: function(req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        } 
        res.redirect('/')
    }

// check permission of the user to determine is she/he can access the page
    // hasPermission: function(req, res, next) {

    // }
};