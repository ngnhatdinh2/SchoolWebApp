var express = require('express');
var userModel = require('../models/user.model');
var postModel = require('../models/post.model');
var passport = require('passport');
var auth = require('../middlewares/auth');

var router = express.Router();

router.get('/', (req, res, next) => {
    Promise.all([
        postModel.all(),
    ]).then(([rows]) => {
        console.log(rows);
        res.render('admin/post', rows);
    })
});
router.get('/post', (req, res, next) => {
    Promise.all([
        postModel.all(),
    ]).then(([rows]) => {
        rows.map(r=>{
            r.onPublish = (id)=>{
                console.log("testing, id")
            }
        });
        console.log(rows)
        res.render('admin/post',{
            posts: rows
        });
    })
});
router.get('/admin/tag', (req, res, next) => {
    Promise.all([
        tagModel.all(),
    ]).then(([rows]) => {
        res.render('admin/tag',{
            tag: rows
        });
    })
});
router.get('/admin/category', (req, res, next) => {
    Promise.all([
        postModel.all(),
    ]).then(([rows]) => {
        res.render('admin/category',{
            category: rows
        });
    })
});
module.exports = router;