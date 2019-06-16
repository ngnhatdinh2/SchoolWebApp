var express = require('express');
var bcrypt = require('bcrypt');
var moment = require('moment');
var userModel = require('../models/user.model');
var passport = require('passport');
var auth = require('../middlewares/auth');
var login = require('../middlewares/login');

var router = express.Router();

router.get('/is-available', (req, res, next) => {
    var user = req.query.username;
    userModel.singleByUsername(user).then(rows => {
        if (rows.length > 0) {
            return res.json(false);
        }

        return res.json(true);
    })
})

router.get('/register',login, (req, res, next) => {
    res.render('vwAccount/register');
})

router.post('/register',login, (req, res, next) => {
    var saltRounds = 10; //tạo key ảo để nối vào password => hash
    var hash = bcrypt.hashSync(req.body.password, saltRounds);
    var dob = moment(req.body.dob, 'DD/MM/YYYY').format('YYYY-MM-DD');

    var entity = {
        name: req.body.name,
        nickname: req.body.nickname,
        email: req.body.email,
        DOB: dob,
        username: req.body.username,
        password: hash,
        Role: 1,
    };
    userModel.add(entity).then(id => {
        res.redirect('/account/login');
    })
})

router.get('/login', login,(req, res, next) => {
    res.render('vwAccount/login');
})

router.post('/login',login,(req, res, next) => {
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

            return res.redirect('/');
        });
    })(req, res, next);
})

router.get('/changepass', auth, (req,res,next)=>{
    res.render('vwAccount/changepass');
})

router.post('/updatepass', auth, (req,res,next)=>{
    var user = res.locals.user;
    var oldpass = req.body.oldpassword; 
    
    var ret = bcrypt.compareSync(oldpass, user.password);
    if (!ret) {
        return res.render('vwAccount/changepass', {
            err_message: 'Invalid Password.'
        })
    }

    var saltRounds = 10; //tạo key ảo để nối vào password => hash
    var hash = bcrypt.hashSync(req.body.newpassword, saltRounds);
    var entity = {
        id: user.id,
        password: hash,
    };

    userModel.update(entity).then(id => {
        res.redirect('/account/login');
    })
})

router.get('/profile/:id', auth, (req, res, next) => {
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

router.post('/update', auth, (req, res, next) => {
    var dob = moment(req.body.dob, 'DD/MM/YYYY').format('YYYY-MM-DD');

    var entity = {
        id: req.body.id,
        name: req.body.name,
        nickname: req.body.nickname,
        email: req.body.email,
        DOB: dob,
    };

    userModel.update(entity).then(id => {
        res.redirect('/');
    }).catch(next);
})

router.get('/history/:id', auth, (req, res, next) => {
    var id = req.params.id;
    if (isNaN(id)) {
        res.render('vwAccount/history', {
            layout: false,
            error: true
        });
    }

    dealModel.singleByIdKH(id).then(rows => {
        var rooms = [];
        rows.forEach(item => {
            for (let index = 0; index < res.locals.lcRooms.length; index++) {
                if (item.idPhong === res.locals.lcRooms[index].idPhong) {
                    res.locals.lcRooms[index].TenNguoiGD = item.TenNguoiGD;
                    rooms.push(res.locals.lcRooms[index]);
                    break;
                }
            }
        });

        if (rows.length > 0) {
            res.render('vwAccount/history', {
                error: false,
                layout: false,
                rooms: rooms
            });
        } else {
            res.render('vwAccount/history', {
                layout: false,
                error: true
            });
        }
    }).catch(next);
})

router.post('/logout', auth, (req, res, next) => {
    req.logOut();
    res.redirect('/account/login');
})

module.exports = router;