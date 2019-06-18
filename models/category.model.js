var db = require('../utils/db');

module.exports = {
    allCateGroup: () => {
        return db.load('select * from categorygroup where isdeleted = 0');
    },

    allCateSmall: () => {
        return db.load('select * from category where isdeleted = 0');
    },
    allNotDeletedCate: () =>{
        return db.load('select * from category where isdeleted = 0');
    },
    cateLimit: (limit) => {
        return db.load(`select * from category where isdeleted = 0 limit ${limit}`);
    },

    single: (id) => {
        return db.load(`select * from category where id = ${id} and isdeleted = 0`);
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