var categoryGroupModel = require('../models/categorygroup.model');
module.exports = (req, res, next) => {
    categoryGroupModel.all().then(rows => {
        res.locals.lcCateGroup = rows;
        next();
    })
};