var postModel = require('../models/post.model');
var userModel = require('../models/user.model');
module.exports = (req, res, next) => {
    Promise.all([
        postModel.all(),
        // userModel
    ]).then(([rows]) => {
        // console.log(rows);
        // res.locals.posts=[{
        //     id:1,
        //     author:"nguyen nhat dinh",
        //     date: "2019-06-12",
        //     status: "pending"
        // }]
        
        res.locals.posts = rows
        next();
    })
}