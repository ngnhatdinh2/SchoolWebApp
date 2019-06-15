var express = require('express');
var router = express.Router();

router.use(require('../middlewares/localMostViewPost.mdw'));

// postmodel.postLimit(1, 3).then((rows) => {
//     console.log(rows);
// }).catch();


router.get('/', (req, res, next) => {
    var postmodel = require('../models/post.model');
    var page = req.query.page < 1 ? 1 : req.query.page;
    var offset = (page - 1) * 10 + 1;
    var limit = 10;
    Promise.all([
        postmodel.postLimitWittCategoryName(offset, limit),
        postmodel.countPost(),
    ]).then(([posts, totalPost]) => {
        var pages = []; // tạo đối tượng pages
        var numbOfPage = Math.ceil(totalPost[0].numb_of_posts / limit); // tính số lượng pages
        for (var i = 1; i <= numbOfPage; i++) {
            var obj = { value: i, isActive: +page === i }; // tạo obj child của pages
            pages.push(obj);

        }
        res.render('postlist', {
            post: posts,
            page: pages,
        })
    }).catch(next);

})


router.get('/:category_id', (req, res, next) => {
    var cate_id = req.params.category_id;
    var postmodel = require('../models/post.model');
    var page = req.query.page < 1 ? 1 : req.query.page;
    var offset = (page - 1) * 10 + 1;
    var limit = 10;
    Promise.all([
        postmodel.allByCate(cate_id, offset,limit),
        postmodel.countPost(cate_id)
    ]).then(([posts, totalPost]) => {
        var pages = []; // tạo đối tượng pages
        var numbOfPage = Math.ceil(totalPost[0].numb_of_posts / limit); // tính số lượng pages
        for (var i = 1; i <= numbOfPage; i++) {
            var obj = { value: i, isActive: +page === i }; // tạo obj child của pages
            pages.push(obj);

        }

        res.render('postlist', {
            post: posts,
            page:pages,
        })
    }).catch(next);
})



module.exports = router;