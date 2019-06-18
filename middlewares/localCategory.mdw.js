var categoryModel = require('../models/category.model');
var cateGroupModel = require('../models/categorygroup.model');
// module.exports = (req, res, next) => {
//     Promise.all([
//         categoryModel.all(),
//         cateGroupModel.all()
//         // userModel
//     ]).then(([rows, cates, categroups]) => {
//         console.log(rows, cates, categroups);
//         res.locals.category = rows
//         next();
//     })
// }