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

    countPost: (cateID=null) => {
        var sql = `select count(*) as numb_of_posts from posts`;
        sql += cateID != null ? ` where posts.id = ${cateID}`: `` ;
        return db.load(sql);
    },    

    temporaryDelete: (id) => {
        return db.temporaryDelete('post', 'id', id);
    },
    
    postLimit: (offset, limit) => {
        return db.load(`select * from posts limit ${offset},${limit} order by id DESC` );
    },


    update: (entity) => {
        return db.update('posts', 'id', entity);
    },

   


    delete: (id) => {
        return db.delete('post', 'id', id);
    }

}