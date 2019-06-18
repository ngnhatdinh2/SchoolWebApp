var express = require('express');
var moment = require('moment');
var Cryptr = require('cryptr');
var cryptr = new Cryptr('titom');
var userModel = require('../models/user.model');
var auth = require('../middlewares/auth');

var router = express.Router();

router.get('/', (req, res, next) => {
    res.redirect('/');
})


/* Renewal Account */
router.get('/renewal', (req, res, next) => {
    res.render('vwAccount/renewal', {
        email: req.user.email
    });
})


//send email get OTP
router.post('/sendmail', (req, res, next) => {
    var email = req.body.email;
    var username = req.user.username;
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
            + '<p>Your account will be renewed <b>7 days</b> from today<p>'
            + '<p>Please access this site to confirm renewal: <a href=http://localhost:4000/subscriber/confirm/' + hash + '>'
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
    res.redirect('/');
})

//confirm reset password to 123456
router.get('/confirm/:username', (req, res, next) => {
    var username = cryptr.decrypt(req.params.username);
    var expDate = moment(Date.now()).add(7, 'days');

    expDate = moment(expDate).format('YYYY-MM-DD');
    
    var entity = {
        username: username,
        expiredDate: expDate,
    };
    console.log(expDate);
    userModel.updateByUsername(entity).then(id => {
        res.redirect('/account/login');
    }).catch(next);
})

module.exports = router;
