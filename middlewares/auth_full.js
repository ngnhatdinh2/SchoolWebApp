module.exports = {
    login: (req, res, next) => {
        console.log(!req.user)
        if (!req.user) {
            console.log('vo dc k');
            res.redirect('/account/login');
        } else next();
    },
    isWriter: (req,res,next) => {
         if (!(req.user.role===3)) {
            console.log('vo dc k');
            res.redirect('/');
        } else next();
    },
}