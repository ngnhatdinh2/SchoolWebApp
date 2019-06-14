var postmodel = require('../models/post.model');
module.exports = (req,res,next) => {
    Promise.all([
        postmodel.mostViewPost(1,1),
        postmodel.mostViewPost(2,4),
    ]).then(([lcMost1,lcMost2]) =>{
        res.locals.most1 = lcMost1;
        res.locals.most2 = lcMost2;
        next();
    })
};