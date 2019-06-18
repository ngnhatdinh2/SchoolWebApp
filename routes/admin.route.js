var express = require('express');
var userModel = require('../models/user.model');
var postModel = require('../models/post.model');
var tagModel = require('../models/tag.model');
var post_tagModel = require('../models/post_tag.model');
var categoryModel = require('../models/category.model');
var cateGroupModel = require('../models/categorygroup.model');
var passport = require('passport');
var auth = require('../middlewares/auth');

var router = express.Router();

router.get('/', (req, res, next) => {
    Promise.all([
        postModel.all(),
    ]).then(([rows]) => {
        res.render('admin/post', rows);
    })
});
router.get('/post', (req, res, next) => {
    Promise.all([
        postModel.allNotDeleted(),
        userModel.getWritter(),
    ]).then(([rows, authors]) => {
        rows.forEach(r=>{
            r.disabled = r.status == 0 ? false : true;
            r.onClick = ()=>{
            }
            // r.author = authors.filter(i=>i.id = r.id)
            // r.disable
        });
        res.render('admin/post',{
            posts: rows
        });
    })
});
// router.delete('/')

router.get('/tag', (req, res, next) => {
    Promise.all([
        tagModel.allNotDeleted(),
        postModel.countByTag(),
    ]).then(([rows, posts]) => {
        rows.forEach((r)=>{
            // console.log('data', posts)
            data = posts.filter(p=>p.tag === r.id)
            r.posts = data === undefined || data == null ? 0 : data[0].total

        })
        // console.log(rows)
        res.render('admin/tag',{
            tags: rows
        });
    })
});
router.post('/tag', (req, res, next) => {
    console.log(req.body.method)
    switch(req.body.method){
        case 'Delete':
            Promise.all([
                // console.log(req.body)
                tagModel.temporaryDelete(req.body.id),
                post_tagModel.tempDeleteByTag(req.body.id)
                // postModel.tempDeleteByCategory(req.body.id)
            ]).then(()=>{
                res.redirect('/admin/tag')            
            })
            break;
        case 'Update':
            tagModel.single(req.body.id)
            .then(tag=>tag[0])
                .then(tag=>{
                    // console.log('single', cate)
                    tag.name = req.body.name
                    return tag
                })
                .then(tag=>{
                    // console.log(cate)
                    categoryModel.update(tag)
                })
                .then(()=>{
                res.redirect('/admin/tag')})
            break;
    }
})
router.get('/category', (req, res, next) => {
    Promise.all([
        categoryModel.allNotDeletedCate(),
        postModel.countByCate(),
        cateGroupModel.all(),
    ]).then(([rows, postsCount, groups]) => {
        // console.log(groups)
        rows.forEach((r)=>{
            data = postsCount.filter(p=>p.cate === r.id)
            r.posts = data === undefined || data == null || data.length ===0 ? 0 : data[0].total
            data = groups.filter(g=>g.id === r.categorygroup_id)
            r.group = data === undefined || data == null || data.length ===0 ? 0 : data[0].name 
        })
        res.render('admin/category',{
            categories: rows,

        });
    })
});
router.post('/category', (req, res, next) => {
    // console.log(req.body.method)
    switch(req.body.method){
        case 'Delete':
            Promise.all([
                categoryModel.temporaryDelete(req.body.id),
                postModel.tempDeleteByCategory(req.body.id)
            ]).then(()=>{
                res.redirect('/admin/category')            
            })
            break;
        case 'Update':
            categoryModel.single(req.body.id)
            .then(cate=>cate[0])
                .then(cate=>{
                    console.log('single', cate)
                    cate.name = req.body.name
                    return cate
                })
                .then(cate=>{
                    // console.log(cate)
                    categoryModel.update(cate)
                })
                .then(()=>{
                res.redirect('/admin/category')})
            break;
    }
})
router.get('/user', (req, res, next) => {
    res.redirect('user/guest')
})
router.get('/user/:role', (req, res, next) => {
    // console.log('role ********',role)
    switch(req.params.role){
        case 'subscriber':
            Promise.all([
                userModel.getSubscriber(),
            ]).then(([rows]) => {
                res.render('admin/user',{
                    role: 'subscriber',
                    users: rows
                });
            })
            break;
        case 'editor':
            Promise.all([
                userModel.getEditor(),
            ]).then(([rows]) => {
                res.render('admin/user',{
                    role: 'editor',
                    users: rows
                });
            })
            break;
        case 'writer':
            Promise.all([
                userModel.getWritter(),
            ]).then(([rows]) => {
                res.render('admin/user',{
                    role: 'writer',
                    users: rows
                });
            })
            break;
        case 'guest':
            Promise.all([
                userModel.getGuest(),
            ]).then(([rows]) => {
                // console.log(rows)
                res.render('admin/user',{
                    role: 'guest',
                    users: rows
                });
            }).catch(console.log)
            break;
        default:
            console.log('defualt')
            res.redirect('guest')
            break;
    }
});
module.exports = router;