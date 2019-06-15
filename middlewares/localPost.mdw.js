var postModel = require('../models/post.model');
var cateModel = require('../models/category.model');
var userModel = require('../models/user.model');

module.exports = (req, res, next) => {
    Promise.all([
        postModel.allWithDetails(),
        cateModel.cateLimit(8),
    ]).then(([rows, cate]) => {
        //tách các phần trong index
        //part1, part3_left1, part3_left2, part3_right, part5
        var part1 = [];
        var part3_left2 = [];
        var part3_right = [];
        var part5 = [];

        for (let i = 0; i < 8; i++) {
            part1.push(rows[i]);
        }
        var part3_left1 = rows[8];
        for (let i = 9; i < 12; i++) {
            part3_left2.push(rows[i]);
        }
        for (let i = 12; i < 16; i++) {
            part3_right.push(rows[i]);
        }
        for (let i = 16; i < 21; i++) {
            part5.push(rows[i]);
        }


        //phần part4
        cate.forEach(item => {
            var posts = [];
            var flag = 0;
            for (let i = 0; i < rows.length; i++) {
                if (rows[i].category_id === item.id) {
                    flag++;
                    item.image_url = rows[i].image_url;
                    posts.push(rows[i]);
                }
                if (flag === 3) {
                    item.image_url = rows[i].image_url;
                    break;
                }
            }
            item.posts = posts;
        });

        res.locals.lcPosts = rows;
        res.locals.lcPart1 = part1;
        res.locals.lcLeft1 = part3_left1;
        res.locals.lcLeft2 = part3_left2;
        res.locals.lcRight = part3_right;
        res.locals.lcPart4 = cate;
        res.locals.lcPart5 = part5;
        next();
    }).catch(next);
}