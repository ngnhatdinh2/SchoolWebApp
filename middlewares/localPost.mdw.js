var postModel = require('../models/post.model');
var cateModel = require('../models/category.model');

module.exports = (req, res, next) => {
    Promise.all([
        postModel.all(),
        postModel.postLimit(0, 8),
        postModel.postLimit(8, 1),
        postModel.postLimit(9, 3),
        postModel.postLimit(12, 4),
        postModel.postLimit(16, 5),
        cateModel.cateLimit(8),
    ]).then(([rows, part1, part3_left1, part3_left2, part3_right, part5, cate]) => {
        cate.forEach(item => {
            var posts = [];
            var flag = 0;
            for (let i = 0; i < rows.length; i++) {
                if (rows[i].category_id === item.id) {
                    flag++;
                    posts.push(rows[i]);
                }
                if (flag === 3){
                    break;
                }
            }
        });
    })
}