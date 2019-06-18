var express = require('express');
var postModel = require('../models/post.model');
var commentModel = require('../models/comment.model');
var postTagModel = require('../models/post_tag.model');

var router = express.Router();

router.use(require('../middlewares/localMostViewPost.mdw'));

router.get('/:idCate/posts/:idPost', (req, res, next) => {
    var id = req.params.idPost;
    var idCate = req.params.idCate;
    if (isNaN(id) || isNaN(idCate)) {
        res.render('vwPosts/detail', {
            error: true
        });
    }

    Promise.all([
        postModel.viewUp(id),
        postModel.single(id),
        postModel.postRelative(1, idCate),
        commentModel.allWithPost(id),
        postTagModel.allWithPost(id),
    ]).then(([tmp, rows, postRelative, comments, post_tag]) => {
        if (comments.length > 0) {
            var isComment = true;
        }

        if (post_tag.length > 0) {
            var isTag = true;
        }

        if (rows.length > 0) {
            res.render('vwPosts/detail', {
                error: false,
                post: rows[0],
                comments: comments,
                post_tag: post_tag,
                postRelative: postRelative,
                isComment: isComment,
                isTag: isTag
            });
        } else {
            res.render('vwPosts/detail', {
                error: true,
                isComment: false,
                isTag: false
            });
        }
    }).catch(next);
});

router.post('/:idCate/posts/:idPost', require('../middlewares/auth').notLogin, (req, res, next) => {
    var idPost = req.params.idPost;
    var idCate = req.params.idCate;

    var today = new Date();
    var entity = {
        content: req.body.comment,
        user_id: req.user.id,
        post_id: idPost,
        date: today,
    };

    commentModel.add(entity).then(id => {
        res.redirect(`/categories/${idCate}/posts/${idPost}`);
    }).catch(next);
});

router.post('/search', (req, res, next) => {
    var entity = req.body.search;

    var page = req.query.page || 1; //lấy dữ liệu trên URL sau '?'
    if (page < 1) page = 1;

    var offset = (page - 1) * 10;
    var limit = 10;

    Promise.all([
        postModel.search(entity, limit, offset),
        postModel.countSearch(entity),
    ]).then(([rows, count_rows]) => {
        if (rows.length > 0) {

            var total = count_rows[0].total;
            var nPages = Math.ceil(total / limit);//lấy giá trị nhỏ hơn gần nhất
            var pages = [];
            for (let i = 1; i <= nPages; i++) {
                var obj = { value: i, active: i === +page }; //+page = page.parseInt()
                pages.push(obj);
            }

            res.render('postlist', {
                post: rows,
                page: pages,
                error: false
            });
        } else {
            res.render('postlist', {
                error: true
            });
        }
    }).catch(next);
});

module.exports = router;