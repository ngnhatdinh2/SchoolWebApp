var tags = require('../models/tag.model');

module.exports = (req, res, next) => {
    tags.all().then(rows=>{
        res.locals.lcTags = rows;
        next();
    }).catch(next);
}