var db = require('../utils/db');

module.exports = {
    allCateGroup: () => {
        return db.load('select * from categorygroup');
    },

    allCateSmall: () => {
        return db.load('select * from category');
    },
    allNotDeletedCate: () =>{
        return db.load('select * from category where isdeleted = 0');
    },
    cateLimit: (limit) => {
        return db.load(`select * from category limit ${limit}`);
    },

    single: (id) => {
        return db.load(`select * from category where id = ${id}`);
    },

    add: (entity) => {
        return db.add('category', entity);
    },

    update: (entity) => {
        return db.update('category', 'id', entity);
    },

    temporaryDelete: (id) => {
        return db.temporaryDelete('category', 'id', id);
    },


    delete: (id) => {
        return db.delete('category', 'id', id);
    }
}