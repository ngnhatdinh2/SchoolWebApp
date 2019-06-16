var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var userModel = require('../models/user.model');
var bcrypt = require('bcrypt');

module.exports = function (app) {
    app.use(passport.initialize());
    app.use(passport.session());

    ls = new localStrategy({
        usernameField: 'username',
        passwordField: 'password'
    }, (username, password, done) => {
        userModel.singleByUsername(username).then(rows => {
            if (rows.length === 0) {
                return done(null, false, { message: 'Invalid Username.' });
            }
            
            var user = rows[0];
            var ret = bcrypt.compareSync(password, rows[0].password);
            if (ret) {
                return done(null, user);
            }
            
            return done(null, false, { message: 'Invalid Password.' });
        }).catch(err => {
            return done(err, false);
        })
    });

    passport.use(ls);

    //chọn một cơ sở dữ liệu và / hoặc ánh xạ đối tượng thích hợp
    passport.serializeUser((user, done) => {
        return done(null, user);
    });

    passport.deserializeUser((user, done) => {
        return done(null, user);
    });
}