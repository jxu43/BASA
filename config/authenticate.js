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
    },

// check permission of the user to determine is she/he can access the page
    hasPermission: function(req, res, next) {
         if (req.isAuthenticated()) {
            if (req.user.role == "educator") {
                return next();
            } else {
                req.flash("error_msg", "You do not have the proper permission to create a class");
                res.redirec("/");
            }
        }
        req.flash('error_msg', 'Please log in to view that resource');
        res.redirect('/users/login');
    }
};