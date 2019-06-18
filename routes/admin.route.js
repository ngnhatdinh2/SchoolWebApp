var express = require('express');
var userModel = require('../models/user.model');
var postModel = require('../models/post.model');
var tagModel = require('../models/tag.model');
var post_tagModel = require('../models/post_tag.model');
var categoryModel = require('../models/category.model');
var cateGroupModel = require('../models/categorygroup.model');
var moment = require('moment');
var passport = require('passport');
var auth = require('../middlewares/auth');

var router = express.Router();

router.get('/', (req, res, next) => {
    res.render('admin/index', {
        layout: false
    })
});
router.get('/post', (req, res, next) => {
    Promise.all([
        postModel.allNotDeleted(),
        userModel.getWritter(),
    ]).then(([rows, authors]) => {
        // console.log(authors)
        rows.forEach(r=>{
            r.disabled = r.status == 0 && r.status != 2 ? false : true;
            r.banned = r.status == 2 ? true : false
            // console.log(r.user_id)
            author = authors.filter(i=>i.id === r.user_id)
            // console.log(author)
            r.author = author[0].name
            // r.disable
        });
        res.render('admin/post',{
            posts: rows,
            layout: false
        });
    })
});
router.post('/post', (req, res, next) => {
    console.log("daadsf", req.body)
    switch(req.body.method){
        case 'Delete':
            Promise.all([
                postModel.temporaryDelete(req.body.id),
            ]).then(()=>{
                res.redirect('/admin/post')
            })
            break;
        case 'Publish':
            postModel.find(req.body.id)
                .then(post=>{;return post[0]})
                .then(post=>{post.status = 1; return post})
                .then(post=>{
                    console.log(post)
                    postModel.update(post)
                })
                .then(()=>{res.redirect('/admin/post')})
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
                        .then(()=>{res.redirect('/admin/post')})
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
                    .then(()=>{res.redirect('/admin/post')})
                    .catch(e=>{console.log(e)})
                // postModel.update({
                //     status: 1
                // }).then(()=>{
                //     res.redirect('/admin/post')            
                // })
                break;
        case 'Add':
            tagModel.add({
                name: req.body.name
            }).then(()=>{
                res.redirect('/admin/tag')})
                break;
    }
})

router.get('/tag', (req, res, next) => {
    Promise.all([
        tagModel.allNotDeleted(),
        postModel.countByTag(),
    ]).then(([rows, posts]) => {
        rows.forEach((r)=>{
            // console.log('data', posts)
            data = posts.filter(p=>p.tag === r.id)
            r.posts = data === undefined || data == null || data.length === 0  ? 0 : data[0].total

        })
        // console.log(rows)
        res.render('admin/tag',{
            tags: rows,
            layout: false
        });
    })
});
router.post('/tag', (req, res, next) => {
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
                    tag.name = req.body.name
                    return tag
                })
                .then(tag=>{
                    tagModel.update(tag)
                })
                .then(()=>{
                res.redirect('/admin/tag')})
            break;
        case 'Add':
            tagModel.add({
                name: req.body.name
            }).then(()=>{
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
            options: groups,
            layout: false
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
        case 'Add':
            categoryModel.add({
                name: req.body.name,
                categorygroup_id: req.body.group
            }).then(()=>{
                res.redirect('/admin/category')
            })
            break;
    }
})
router.get('/user', (req, res, next) => {
    res.redirect('user/subscriber')
})
router.post('/user', (req, res, next)=>{
    switch(req.body.method){
        case 'Delete':
            Promise.all([
                userModel.temporaryDelete(req.body.id)
            ]).then(()=>{
                res.redirect('user')           
            })
            break;
        case 'Update':
            userModel.single(req.body.id)
                .then(user=>user[0])
                .then(user=>{
                    // console.log(req.body.DOB.replace("/","-"))
                    user.username= req.body.username;
                    user.name= req.body.name;
                    // var s = req.body.DOB.replaceAll("/","-")
                    user.DOB = moment(req.body.DOB, "MM/DD/YYYY").format("YYYY-MM-DD");
                    user.expiredDate= req.body.expiredDate;
                    user.email= req.body.email;
                    user.nickname= req.body.nickname;
                    return user
                })
                .then(user=>{
                    console.log(user)
                    userModel.update(user)
                })
                .then(()=>{
                    res.redirect('user')
                })
        }
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
                    users: rows,
                    layout: false
                });
            })
            break;
        case 'editor':
            Promise.all([
                userModel.getEditor(),
            ]).then(([rows]) => {
                res.render('admin/user',{
                    role: 'editor',
                    users: rows,
                    editor: true,
                    layout: false
                });
            })
            break;
        case 'writer':
            Promise.all([
                userModel.getWritter(),
            ]).then(([rows]) => {
                res.render('admin/user',{
                    role: 'writer',
                    users: rows,
                    layout: false
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
                    users: rows,
                    layout: false
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