var express = require('express');
var router = express.Router();

router.use(require('../middlewares/localMostViewPost.mdw'));

// postmodel.postLimit(1, 3).then((rows) => {
//     console.log(rows);
// }).catch();


router.get('/', (req, res, next) => {
    var postmodel = require('../models/post.model');
    var page = (req.query.page < 1 || req.query.page == null) ? 1 : req.query.page;
    var offset = (page - 1) * 10;
    var limit = 10;
    var ispremium = (req.user !=null&&req.user.role==1&&new Date(req.user.expiredDate)>new Date)? 1:0;
    Promise.all([
        postmodel.postLimitWittCategoryName(offset, limit, ispremium),
        postmodel.countPostByCate(ispremium),
    ]).then(([posts, totalPost]) => {
        var pages = []; // tạo đối tượng pages
        var numbOfPage = Math.ceil(totalPost[0].numb_of_posts / limit); // tính số lượng pages
        numbOfPage = numbOfPage==0?1:numbOfPage;
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
    var postmodel = require('../models/post.model');
    var cate_id = req.params.category_id;
    var page = (req.query.page < 1 || req.query.page == null) ? 1 : req.query.page;
    var offset = (page - 1) * 10;
    var limit = 10;
    var ispremium = (req.user !=null&&req.user.role==1&&new Date(req.user.expiredDate)>new Date)? 1:0;
    Promise.all([
        postmodel.allByCate(cate_id, offset, limit,ispremium),
        postmodel.countPostByCate(ispremium,cate_id),
        postmodel.getDirect(cate_id),
    ]).then(([posts, totalPost,direct]) => {
        var pages = []; // tạo đối tượng pages
        var numbOfPage = Math.ceil(totalPost[0].numb_of_posts / limit); // tính số lượng pages
        numbOfPage = numbOfPage==0?1:numbOfPage;
        for (var i = 1; i <= numbOfPage; i++) {
            var obj = { value: i, isActive: +page === i }; // tạo obj child của pages
            pages.push(obj);

        }

        res.render('postlist', {
            post: posts,
            page: pages,
            direct: direct,
        })
    }).catch(next);
})

router.get('/tags/:tag_id', (req, res, next) => {
    var postmodel = require('../models/post.model');
    var tag_id = req.params.tag_id;
    var page = (req.query.page < 1 || req.query.page == null) ? 1 : req.query.page;
    var offset = (page - 1) * 10;
    var limit = 10;
    var ispremium = (req.user !=null&&req.user.role==1&&new Date(req.user.expiredDate)>new Date)? 1:0;
    Promise.all([
        postmodel.allByTag(tag_id, offset, limit,ispremium),
        postmodel.countPostByTag(ispremium,tag_id)
    ]).then(([posts, totalPost]) => {
        var pages = []; // tạo đối tượng pages
        var numbOfPage = Math.ceil(totalPost[0].numb_of_posts / limit); // tính số lượng pages
        numbOfPage = numbOfPage==0?1:numbOfPage;
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




module.exports = router;