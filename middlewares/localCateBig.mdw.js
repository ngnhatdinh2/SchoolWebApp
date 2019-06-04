var categoryModel = require('../models/category.model');
module.exports = (req,res,next) => {
    categoryModel.allCateBig().then(rows =>{
        res.locals.lcCateBig = rows;
        next();
    })
};