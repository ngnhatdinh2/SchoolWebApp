var db = require('../utils/db');

module.exports = {
    all: () => {
        return db.load('select * from posts order by id DESC');
    },
    allNotDeleted: () => {
        return db.load('select * from posts where isdeleted = 0 order by id DESC');
    },
    allWithDetails: () => {
        return db.load('SELECT p.id, p.title, p.publish_date, p.abstract_body, p.full_body, p.thumbnail_url,p.image_url,p.status,p.view,p.user_id,p.category_id,p.isdeleted, cate.name as topic, user.name as author FROM posts p JOIN category cate ON p.category_id = cate.id JOIN user ON p.user_id = user.id order by p.id DESC');
    },

    allByCate: (idCate) => {
        return db.load(`select * from posts where category_id = ${idCate} order by id DESC`);
    },

    postLimit: (offset, limit) => {
        return db.load(`select * from posts limit ${offset},${limit} order by id DESC`);
    },

    postRelative: (id, idCate) => {
        return db.load(`SELECT p.id, p.title, p.publish_date, p.abstract_body, p.full_body, p.thumbnail_url,p.image_url,p.status,p.view,p.user_id,p.category_id,p.isdeleted, cate.name as topic, user.name as author FROM posts p JOIN category cate ON p.category_id = cate.id JOIN user ON p.user_id = user.id WHERE p.id != ${id} and cate.id = ${idCate} order by p.id DESC LIMIT 5`);
    },

    single: id => {
        return db.load(`SELECT p.id, p.title, p.publish_date, p.abstract_body, p.full_body, p.thumbnail_url,p.image_url,p.status,p.view,p.user_id,p.category_id,p.isdeleted, cate.name as topic, user.name as author FROM posts p JOIN category cate ON p.category_id = cate.id JOIN user ON p.user_id = user.id WHERE p.id = ${id}`);
    },


    add: (entity) => {
        return db.add('posts', entity);
    },

    update: (entity) => {
        return db.update('posts', 'id', entity);
    },

    temporaryDelete: (id) => {
        return db.temporaryDelete('posts', 'id', id);
    },
    tempDeleteByCategory: (cateID) =>{
        return db.temporaryDelete('posts', 'category_id', cateID);
    },
    countByTag: () => {
        return db.load(`select tag_id as tag, count(post_id) as total from post_tag group by tag_id`)
    },
    countByCate: () => {
        return db.load(`select category_id as cate, count(id) as total from posts group by category_id`)
    },
    delete: (id) => {
        return db.delete('posts', 'id', id);
    }

}