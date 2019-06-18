var postModel = require('../models/post.model');
var cateModel = require('../models/category.model');
var userModel = require('../models/user.model');

module.exports = (req, res, next) => {
    Promise.all([
        postModel.allWithDetails(),
        postModel.topCate(8),
        postModel.topPost(10),
        cateModel.cateLimit(6),
    ]).then(([rows, topCate, topPost, cate]) => {
        //tách các phần trong index
        //part1, part3_left1, part3_left2, part3_right, part5
        var part3_left2 = [];
        var part3_right = [];
        var part4_1 = [];
        var part4_2 = [];
        var part5 = [];

        var part3_left1 = topPost[0];
        for (let i = 1; i < 4; i++) {
            part3_left2.push(topPost[i]);
        }
        for (let i = 4; i < 10; i++) {
            part3_right.push(topPost[i]);
        }
        for (let i = rows.length - 6; i < rows.length; i++) {
            part5.push(rows[i]);
        }


        //phần part4
        cate.forEach(item => {
            var posts = [];
            var flag = 0;
            for (let i = 0; i < rows.length; i++) {
                if (rows[i].category_id === item.id) {
                    flag++;
                    item.postModel = rows[i];
                    posts.push(rows[i]);
                }
                if (flag === 6) {
                    item.postModel = rows[i];
                    break;
                }
            }
            item.posts = posts;
        });

        for (let i = 0; i < 3; i++) {
            part4_1.push(cate[i]);
        }

        for (let i = 3; i < 6; i++) {
            part4_2.push(cate[i]);
        }

        res.locals.lcPosts = rows;
        res.locals.lcPart1 = topCate;
        res.locals.lcLeft1 = part3_left1;
        res.locals.lcLeft2 = part3_left2;
        res.locals.lcRight = part3_right;
        res.locals.lcPart4_1 = part4_1;
        res.locals.lcPart4_2 = part4_2;
        res.locals.lcPart5 = part5;
        next();
    }).catch(next);
}