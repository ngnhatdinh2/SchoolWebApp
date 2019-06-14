var express = require('express');
var router = express.Router();

var postmodel = require('../models/post.model');

// postmodel.postLimit(1, 3).then((rows) => {
//     console.log(rows);
// }).catch();


router.get('/', (req, res, next) => {
    var postmodel = require('../models/post.model');
    postmodel.postLimitWittCategoryName(1, 10).then((posts) => {
        res.render('postlist', {
            post: posts,
        })
    }).catch(next);

})
router.use(require('../middlewares/localMostViewPost.mdw'));


router.get('/:category_id',(req,res,next) => {
    var postmodel = require('../models/post.model');
    Promise.all([

    ]).then(([])=>{
        res.render('postlist',{

        })

    }).catch(next);
})



module.exports = router;