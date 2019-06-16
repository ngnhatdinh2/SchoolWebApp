module.exports = (req, res, next) => {
    if (req.user) {
        res.locals.isAuthenticated = true;
        res.locals.user = req.user;
        res.locals.pass = req.user.password;
        res.locals.id = req.user.id;
        res.locals.avatar = req.user.avatar;
    }

    next();
}
