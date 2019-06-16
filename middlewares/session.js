var session = require('express-session');

module.exports = function (app) {
    app.use(session({
        secret: 'nhomtiton',
        resave: true,
        saveUninitialized: true,
    }));
}