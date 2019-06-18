var express = require('express');
var userModel = require('../models/user.model');
var postModel = require('../models/post.model');
var editorModel = require('../models/editor.model');
var tagModel = require('../models/tag.model');
var post_tagModel = require('../models/post_tag.model');
var categoryModel = require('../models/category.model');
var cateGroupModel = require('../models/categorygroup.model');
// var moment = require('moment');
// var passport = require('passport');
// // var auth = require('../middlewares/auth');

var router = express.Router();

router.get('/', (req, res, next)=>{
     res.render('editor/index', {
            layout: false
        })
})
router.get('/draft', (req, res, next)=>{
    editorModel.selectByEditor(res.locals.user.id)
    .then(editor=>{ return editor[0]}).then(editor=>{
        Promise.all([    
            postModel.allByByCate(editor.category_id),
            userModel.getWritter(),
            categoryModel.allCateSmall(),
        ]).then(([rows, authors, cate]) => {
            console.log(rows)
            rows.forEach(r=>{
                r.disabled = r.status == 0 && r.status != 2 ? false : true;
                r.banned = r.status == 2 ? true : false
                // console.log(r.user_id)
                author = authors.filter(i=>i.id === r.user_id)
                // console.log(author)
                r.author = author[0].name
                // r.disable
            });
            var cateName;
            cate.forEach(r=>{
                if (r.id === editor.category_id){
                    cateName = r.name;
                }
            })
            res.render('editor/index', {
                posts: rows,
                category: cateName,
                layout: false
            })
        })
    }).catch(()=>{
        res.render('editor/index', {
            posts: null,
            category: null,
            layout: false
        })
    });
})
router.post('/draft', (req, res, next) => {

    switch(req.body.method){
        case 'Publish':
            postModel.find(req.body.id)
                .then(post=>{;return post[0]})
                .then(post=>{post.status = 1; return post})
                .then(post=>{
                    console.log(post)
                    postModel.update(post)
                })
                .then(()=>{res.redirect('/editor/draft')})
                .catch(e=>{console.log(e)})
            // postModel.update({
            //     status: 1
            // }).then(()=>{
            //     res.redirect('/admin/post')            
            // })
            break;
            case 'Ban':
                    postModel.find(req.body.id)
                        .then(post=>{;return post[0]})
                        .then(post=>{post.status = 2; return post})
                        .then(post=>{
                            console.log(post)
                            postModel.update(post)
                        })
                        .then(()=>{res.redirect('/editor/draft')})
                        .catch(e=>{console.log(e)})
                    // postModel.update({
                    //     status: 1
                    // }).then(()=>{
                    //     res.redirect('/admin/post')            
                    // })
                    break;
            case 'Unban':
                console.log("CAMMMMMM");
                postModel.find(req.body.id)
                    .then(post=>{;return post[0]})
                    .then(post=>{post.status = 0; return post})
                    .then(post=>{
                        console.log(post)
                        postModel.update(post)
                    })
                    .then(()=>{res.redirect('/editor/draft')})
                    .catch(e=>{console.log(e)})
                // postModel.update({
                //     status: 1
                // }).then(()=>{
                //     res.redirect('/admin/post')            
                // })
                break;
    }
})

module.exports = router;
