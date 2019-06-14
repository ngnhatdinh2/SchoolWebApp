var db = require('../utils/db');

module.exports = {
    all: () => {
        return db.load('select * from post order by id DESC');
    },

    allByCate: (idCate) => {
        return db.load(`select * from post where category_id = ${idCate} order by id DESC`);
    },

    postLimit: (offset, limit) => {
        return db.load(`select * from post limit ${offset},${limit}`);
    },

    add: (entity) => {
        return db.add('post', entity);
    },

    update: (entity) => {
        return db.update('post', 'id', entity);
    },

    temporaryDelete: (id) => {
        return db.temporaryDelete('post', 'id', id);
    },


    delete: (id) => {
        return db.delete('post', 'id', id);
    }

}