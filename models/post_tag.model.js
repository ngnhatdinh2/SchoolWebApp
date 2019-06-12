var db = require('../utils/db');

module.exports = {
    all: () => {
        return db.load('select * from post_tag');
    },

    add:(entity)=> {
        return db.add('post_tag', entity);
    },

    update: (entity) => {
        return db.update('post_tag','id',entity);
    },

    temporaryDelete: (id) => {
        return db.temporaryDelete('post_tag', 'id', id);
    },

    delete: (id) => {
        return db.delete('post_tag','id',id);
    }

}