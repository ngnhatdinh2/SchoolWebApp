var db = require('../utils/db');

module.exports = {
    all: () => {
        return db.load('select * from posts order by id DESC');
    },

    allByCate: (idCate) => {
        return db.load(`select * from posts where category_id = ${idCate} order by id DESC`);
    },

    allByCate: (idCate, offset, limit) => {
        return db.load(`select p.*, c.name as category_name from(select * from posts where category_id = ${idCate} limit ${offset},${limit}) p, category c where p.category_id = c.id`)
    },

    mostViewPost: (offset,limit) => {
        return db.load(`select p.* , c.name as category_name from posts p, category c where p.category_id = c.id ORDER BY p.view DESC LIMIT ${offset},${limit}`);
    },

    postLimitWittCategoryName: (offset,limit) => {
        return db.load(`select p.* , c.name as category_name from (select * from posts limit ${offset},${limit}) p, category c where p.category_id = c.id`)
    },

    postLimit: (offset, limit) => {
        return db.load(`select * from posts limit ${offset},${limit}`);
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