var db = require('../utils/db');

module.exports = {
    all: () => {
        return db.load('select * from tag');
    },

    add:(entity)=> {
        return db.add('tag', entity);
    },

    update: (entity) => {
        return db.update('tag','id',entity);
    },

    temporaryDelete: (id) => {
        return db.temporaryDelete('tag', 'id', id);
    },

    delete: (id) => {
        return db.delete('tag','id',id);
    }

}