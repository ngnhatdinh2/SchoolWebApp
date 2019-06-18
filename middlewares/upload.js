var multer = require('multer');
var path = require('path');
var userModel = require('../models/user.model');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/avatar');
    },
    filename: function (req, file, cb) {
        if (!req.user) {
            userModel.nextId().then(id => {
                var string = JSON.stringify(id);
                var rs = JSON.parse(string);
                cb(null, rs[0].AUTO_INCREMENT + path.extname(file.originalname));
            });
        } else {
            cb(null, req.user.id + path.extname(file.originalname));
        }
    }
})

var upload = multer({ storage });

module.exports = upload;