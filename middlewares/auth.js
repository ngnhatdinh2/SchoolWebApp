module.exports = {
    notLogin: (req, res, next) => {
        if (!req.user) {
            res.redirect('/account/login');
        } else next();
    },
    inLogin: (req, res, next) => {
        if (req.user) {
            res.redirect('/');
        } else next();
    },
    isWriter: (req, res, next) => {
        if (!(req.user.role === 3)) {
            res.redirect('/pagenotfound');
        } else next();
    },
    isSubscriber: (req, res, next) => {
        if (!(req.user.role === 1)) {
            res.redirect('/pagenotfound');
        } else next();
    },
    isEditor: (req, res, next) => {
        if (!(req.user.role === 2)) {
            res.redirect('/pagenotfound');
        } else next();
    },
    isAdmin: (req, res, next) => {
        if (!(req.user.role === 4)) {
            res.redirect('/pagenotfound');
        } else next();
    },
}