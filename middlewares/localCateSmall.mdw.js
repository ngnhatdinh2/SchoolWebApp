var categoryModel = require('../models/category.model');

module.exports = (req, res, next) => {
    categoryModel.allCateSmall().then(rows => {
        res.locals.lcCateSmall = rows;
        next();
    }).catch(next);
};