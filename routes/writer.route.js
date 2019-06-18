var express = require('express');
var auth = require('../middlewares/auth_full');
var router = express.Router();
var upload = require('../middlewares/uploadPost');


router.use(require('../middlewares/localWriterAction.mdw').actionList);

router.get('/', auth.login, auth.isWriter, (req, res, next) => {
    var postmodel = require('../models/post.model');
    postmodel.allByUserIdAndStatus(res.locals.user.id).then((posts) => {
        for (const c of res.locals.lcActionList) {
            if (String(c.href) === '/writer')
                c.isActive = true;
            else
                c.isActive = false;
        }
        res.render('writer', {
            posts: posts
        });


    }).catch(next);
})

router.get('/newpost', auth.login, auth.isWriter, (req, res, next) => {
    for (const c of res.locals.lcActionList) {
        if (String(c.href) === '/writer/publishedpost')
            c.isActive = true;
        else
            c.isActive = false;
    }
    res.render('newpost');
});

router.post('/newpmost', auth.login, auth.isWriter, (req, res, next) => {
    var postmodel = require('../models/post.model');
    var post_tag_model = require('../models/post_tag.model');
    var length = req.body.tags == null ? 0 : req.body.tags.length;
    var tags = req.body.tags;

    upload.single('image_url')(req, res, err => {
        if (err) {
            return res.json({
                error: err.message
            });
        }
        var image_url;
        if (req.file)
            image_url = '/images/post/' + req.file.filename;

        req.body.user_id = res.locals.user.id;
        req.body.publish_date = new Date();
        req.body.image_url = image_url;
        postmodel.add(req.body).then((id) => {
            var entities = [];
            for (var i = 0; i < length; i++) {
                var obj = { post_id: id, tag_id: tags[i] };
                entities.push(obj);
            }
            post_tag_model.multiAdd(entities)
            res.render('writer');
        }).catch(next);

    })
})

router.get('/publishedpost', auth.login, auth.isWriter, (req, res, next) => {
    var postmodel = require('../models/post.model');
    postmodel.allByUserIdAndStatus(res.locals.user.id, 1).then((posts) => {
        for (const c of res.locals.lcActionList) {
            if (String(c.href) === '/writer/publishedpost')
                c.isActive = true;
            else
                c.isActive = false;
        }
        res.render('writer', {
            posts: posts
        });
    }).catch(next);
})


router.get('/pendingpost', auth.login, auth.isWriter, (req, res, next) => {
    var postmodel = require('../models/post.model');
    postmodel.allByUserIdAndStatus(res.locals.user.id, 0).then((posts) => {
        for (const c of res.locals.lcActionList) {
            if (String(c.href) === '/writer/pendingpost')
                c.isActive = true;
            else
                c.isActive = false;
        }
        res.render('writer', {
            posts: posts
        });


    }).catch(next);
})

router.get('/bannedpost', auth.login, auth.isWriter, (req, res, next) => {
    var postmodel = require('../models/post.model');
    postmodel.allByUserIdAndStatus(res.locals.user.id, 2).then((posts) => {
        for (const c of res.locals.lcActionList) {
            if (String(c.href) === '/writer/bannedpost')
                c.isActive = true;
            else
                c.isActive = false;
        }
        res.render('writer', {
            posts: posts
        });


    }).catch(next);
})

router.get('/editpost/:id', auth.login, auth.isWriter, (req, res) => {
    var postid = req.params.id;
    var postmodel = require('../models/post.model');
    var post_tag_model = require('../models/post_tag.model');
    Promise.all([
        postmodel.single(postid),
        post_tag_model.allWithPost(postid),
    ])
        .then(([post, posttag]) => {
            for (const c of res.locals.lcCateSmall) {
                if (c.id == post[0].category_id)
                    c.isSelected = true;
                else
                    c.isSelected = false;
            }
            for (const c of res.locals.lcTags) {
                for (const t of posttag) {
                    if (c.id == t.tag_id) {
                        c.isCheck = true;
                        break;
                    }
                    else
                        c.isCheck = false;
                }
            }
            res.render('editpost', {
                detailPost: post
            });
        })
});

router.post('/editpost', auth.login, auth.isWriter, (req, res, next) => {
    var postmodel = require('../models/post.model');
    var post_tag_model = require('../models/post_tag.model');
    var entities = [];
    var length = req.body.tags == null ? 0 : req.body.tags.length;
    for (var i = 0; i < length; i++) {
        var obj = { post_id: req.body.id, tag_id: req.body.tags[i] };
        entities.push(obj);
    }

    upload.single('image_url')(req, res, err => {
        if (err) {
            return res.json({
                error: err.message
            });
        }
        var image_url;
        if (req.file)
            image_url = '/images/post/' + req.file.filename;

        req.body.image_url = image_url;
        var postid = req.body.id;
        console.log(req.body);
        Promise.all([
            postmodel.update(req.body),
            post_tag_model.deleteByPostID(postid).then(() => {
                post_tag_model.multiAdd(entities)
            })

        ]).then(() => {
            res.render('writer');
        }).catch(next);
    })

});

module.exports = router;