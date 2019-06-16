var express = require('express');
var postModel = require('../models/post.model');
var commentModel = require('../models/comment.model');
var postTagModel = require('../models/post_tag.model');

var router = express.Router();

router.get('/:idCate/posts/:idPost', (req, res, next) => {
    var id = req.params.idPost;
    var idCate = req.params.idCate;
    if (isNaN(id) || isNaN(idCate)) {
        res.render('vwPosts/detail', {
            error: true
        });
    }

    Promise.all([
        postModel.single(id),
        postModel.postRelative(1, idCate),
        commentModel.allWithPost(id),
        postTagModel.allWithPost(id),
    ]).then(([rows, postRelative, comments, post_tag]) => {
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

router.post('/search', (req, res, next) => {
    var entity = req.body.search;

    var page = req.query.page || 1; //lấy dữ liệu trên URL sau '?'
    if (page < 1) page = 1;

    var limit = 6;
    var offset = (page - 1) * limit;

    Promise.all([
        postModel.search(entity, limit, offset),
        postModel.countSearch(entity),
    ]).then(([rows, count_rows]) => {
        if (rows.length > 0) {

            var total = count_rows[0].total;
            var nPages = Math.floor(total / limit);//lấy giá trị nhỏ hơn gần nhất
            if (total % limit > 0) nPages++;
            var pages = [];
            for (let i = 1; i <= nPages; i++) {
                var obj = { value: i, active: i === +page }; //+page = page.parseInt()
                pages.push(obj);
            }

            res.render('vwPosts/search', {
                posts: rows,
                pages: pages,
                error: false
            });
        } else {
            res.render('vwPosts/search', {
                error: true
            });
        }
    }).catch(next);
});

module.exports = router;