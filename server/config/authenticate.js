module.exports = {
    hasAuth: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('error_msg', 'Please log in to view that resource');
        res.redirect('/login');
    },
    needAuth: function(req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        }
        res.redirect('/login-home');
    }
};