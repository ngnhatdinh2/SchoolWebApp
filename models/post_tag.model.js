var db = require('../utils/db');

module.exports = {
    all: () => {
        return db.load('select * from post_tag');
    },

    allWithPost: (id) => {
        return db.load(`SELECT pt.id,pt.post_id,pt.tag_id,tag.name as nametag FROM post_tag pt JOIN tag ON pt.tag_id = tag.id WHERE pt.post_id = ${id}`);
    },

    add: (entity) => {
        return db.add('post_tag', entity);
    },

    update: (entity) => {
        return db.update('post_tag', 'post_id', entity);
    },

    deleteByPostID: (postid) => {
        return db.delete('post_tag', 'post_id', postid);
    },

    multiAdd: (entities) => {
        return db.multiAddForPostTag('post_tag', entities);
    },



    temporaryDelete: (id) => {
        return db.temporaryDelete('post_tag', 'id', id);
    },

    delete: (id) => {
        return db.delete('post_tag', 'id', id);
    }
}
