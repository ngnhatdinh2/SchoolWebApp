var multer = require('multer');
var path = require('path');
var postModel = require('../models/post.model');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/post');
    },
    filename: function (req, file, cb) {
        postModel.nextId().then(id => {
            var string = JSON.stringify(id);
            var rs = JSON.parse(string);
            cb(null, rs[0].AUTO_INCREMENT + path.extname(file.originalname));
        });
    }
})

var upload = multer({ storage });

module.exports = upload;