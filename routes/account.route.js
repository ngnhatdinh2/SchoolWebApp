var express = require('express');
var bcrypt = require('bcrypt');
var moment = require('moment');
var Cryptr = require('cryptr');
var cryptr = new Cryptr('titom');
var userModel = require('../models/user.model');
var passport = require('passport');
var auth = require('../middlewares/auth');
var upload = require('../middlewares/upload');

var router = express.Router();

//check username
router.get('/is-available', (req, res, next) => {
    var user = req.query.username;
    userModel.singleByUsername(user).then(rows => {
        if (rows.length > 0) {
            return res.json(false);
        }

        return res.json(true);
    })
})

router.get('/is-username', (req, res, next) => {
    var user = req.query.username;
    userModel.singleByUsername(user).then(rows => {
        if (rows.length > 0) {
            return res.json(true);
        }

        return res.json(false);
    })
})

//check email
router.get('/is-available-email', (req, res, next) => {
    var email = req.query.email;
    userModel.singleByEmail(email).then(rows => {
        if (rows.length > 0) {
            return res.json(false);
        }

        return res.json(true);
    })
})

router.get('/is-email', (req, res, next) => {
    var email = req.query.email;
    userModel.singleByEmail(email).then(rows => {
        if (rows.length > 0) {
            return res.json(true);
        }

        return res.json(false);
    })
})

//account action
router.get('/register', auth.inLogin, (req, res, next) => {
    res.render('vwAccount/register');
})

router.post('/register', auth.inLogin, (req, res, next) => {
    upload.single('avatar')(req, res, err => {
        if (err) {
            return res.json({
                error: err.message
            });
        }

        var saltRounds = 10; //tạo key ảo để nối vào password => hash
        var hash = bcrypt.hashSync(req.body.password, saltRounds);
        var dob = moment(req.body.dob, 'DD/MM/YYYY').format('YYYY-MM-DD');

        var avatar;
        if (req.file) {
            avatar = '/images/avatar/' + req.file.filename;
        } else {
            avatar = '/images/avatar/avatar.png';
        }

        var entity = {
            avatar: avatar,
            name: req.body.name,
            nickname: req.body.nickname,
            email: req.body.email,
            DOB: dob,
            username: req.body.username,
            password: hash,
        };

        userModel.add(entity).then(id => {
            res.redirect('/account/login');
        }).catch(next);
    })
})

router.get('/login', auth.inLogin, (req, res, next) => {
    res.render('vwAccount/login');
})

router.post('/login', auth.inLogin, (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err)
            return next(err);

        if (!user) {
            return res.render('vwAccount/login', {
                err_message: info.message
            })
        }

        req.logIn(user, err => {
            if (err)
                return next(err);
            switch (user.role) {
                case 1:
                    if (user.expiredDate.getTime() < Date.now())
                        return res.redirect('/subscriber/renewal');
                    return res.redirect('/');
                case 2:
                    return res.redirect('/editor');
                case 3:
                    return res.redirect('/writer');
                case 4:
                    return res.redirect('/admin');
            }

            if (user.role === 1)
                return res.redirect('/');
        });
    })(req, res, next);
})

router.get('/changepass', auth.notLogin, (req, res, next) => {
    res.render('vwAccount/changepass');
})

router.post('/updatepass', auth.notLogin, (req, res, next) => {
    var pass = req.user.password;
    var oldpass = req.body.oldpassword;

    var ret = bcrypt.compareSync(oldpass, pass);
    console.log(ret);
    if (!ret) {
        return res.render('vwAccount/changepass', {
            err_message: 'Invalid Password.'
        })
    }

    var saltRounds = 10; //tạo key ảo để nối vào password => hash
    var hash = bcrypt.hashSync(req.body.newpassword, saltRounds);
    var entity = {
        id: req.user.id,
        password: hash,
    };

    userModel.update(entity).then(id => {
        req.logOut();
        res.redirect('/account/login');
    }).catch(next);
})

router.get('/profile/:id', auth.notLogin, (req, res, next) => {
    var id = req.params.id;
    if (isNaN(id)) {
        res.render('vwAccount/profile', {
            error: true
        });
    }

    userModel.single(id).then(rows => {
        if (rows.length > 0) {
            var cus = rows[0];
            cus.DOB = moment(cus.DOB, 'YYYY-MM-DD').format('DD/MM/YYYY');
            cus.expiredDate = moment(cus.expiredDate, 'YYYY-MM-DD').format('DD/MM/YYYY');
            res.render('vwAccount/profile', {
                error: false,
                cus: cus
            });
        } else {
            res.render('vwAccount/profile', {
                error: true
            });
        }
    }).catch(next);
})

router.post('/update', auth.notLogin, (req, res, next) => {
    upload.single('avatar')(req, res, err => {
        if (err) {
            return res.json({
                error: err.message
            });
        }
        var dob = moment(req.body.dob, 'DD/MM/YYYY').format('YYYY-MM-DD');

        var avatar;
        if (req.file) {
            avatar = '/images/avatar/' + req.file.filename;
        } else {
            avatar = req.user.avatar;
        }

        var entity = {
            id: req.body.id,
            name: req.body.name,
            nickname: req.body.nickname,
            email: req.body.email,
            DOB: dob,
            avatar: avatar,
        };

        userModel.update(entity).then(id => {
            res.redirect('/');
        }).catch(next);
    })
})

router.post('/logout', auth.notLogin, (req, res, next) => {
    req.logOut();
    res.redirect('/account/login');
})

/* Forget Password */
router.get('/forgotpass', auth.inLogin, (req, res, next) => {
    res.render('vwAccount/forgot');
})


//send email get OTP
router.post('/sendmail', auth.inLogin, (req, res, next) => {
    var email = req.body.email;
    var username = req.body.username;
    var hash = cryptr.encrypt(username);

    var nodemailer = require('nodemailer');
    console.log(hash);

    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'vngchatservice@gmail.com',
            pass: 'vng123456'
        }
    });
    var mailOptions = {
        from: 'vngchatservice@gmail.com',
        to: email,
        subject: 'Confirm password',
        html: '<h1>Welcome</h1><p>TiTom!</p>'
            + '<p>Your default password is <b>123456</b><p>'
            + '<p>Please access this site to confirm password: <a href=http://localhost:4000/account/confirm/' + hash + '>'
            + 'titom.com</a>'
            + '<p>Have a nice day!</p>'
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
    res.redirect('/account/login');
})

//confirm reset password to 123456
router.get('/confirm/:username', auth.inLogin, (req, res, next) => {
    var saltRounds = 10; //tạo key ảo để nối vào password => hash
    var hash = bcrypt.hashSync('123456', saltRounds);

    var username = cryptr.decrypt(req.params.username);

    console.log(username);
    console.log(hash);
    var entity = {
        username: username,
        password: hash,
    };

    userModel.updateByUsername(entity).then(id => {
        res.redirect('/account/login');
    }).catch(next);
})


module.exports = router;