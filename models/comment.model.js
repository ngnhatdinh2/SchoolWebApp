var db = require('../utils/db');

module.exports = {
    all: () => {
        return db.load('select * from comment order by id DESC');
    },

    allWithDetails: () => {
        return db.load('SELECT p.id, p.title, p.publish_date, p.abstract_body, p.full_body, p.thumbnail_url,p.image_url,p.status,p.view,p.user_id,p.category_id,p.isdeleted, cate.name as topic, user.name as author FROM comment p JOIN category cate ON p.category_id = cate.id JOIN user ON p.user_id = user.id order by p.id DESC');
    },

    commentLimit: (offset, limit) => {
        return db.load(`select * from comment limit ${offset},${limit} order by id DESC`);
    },

    allWithPost: id => {
        return db.load(`SELECT cm.id, cm.content, cm.user_id, cm.post_id, user.name as reader FROM comment cm JOIN user ON cm.user_id = user.id WHERE cm.post_id = ${id} order by id DESC`);
    },

    add: (entity) => {
        return db.add('comment', entity);
    },

    update: (entity) => {
        return db.update('comment', 'id', entity);
    },

    temporaryDelete: (id) => {
        return db.temporaryDelete('comment', 'id', id);
    },


    delete: (id) => {
        return db.delete('comment', 'id', id);
    }

}