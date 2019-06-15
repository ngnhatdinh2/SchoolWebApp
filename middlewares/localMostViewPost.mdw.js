var postmodel = require('../models/post.model');
module.exports = (req,res,next) => {
    Promise.all([
        postmodel.mostViewPost(1,1),
        postmodel.mostViewPost(2,4),
    ]).then(([Most1,Most2]) =>{
        res.locals.lcMost1 = Most1;//most1 là bài viết nhieu view nhất(all Cate)
        res.locals.lcMost2 = Most2;//most2 là 4 bài viết nhièu view tiếp theo(all cate)
        next();
    })
};