var db = require('../utils/db');

module.exports = {
    allCateBig: () => {
        return db.load('select * from category where danh_muc_cha = null');
    },

    allCateSmall: () => {
        return db.load('select * from category where danh_muc_cha != null');
    },

    all: () => {
        return db.load('select * from category');
    },

    single: (id) =>{
        return db.load(`select * from category where id = '${id}'`);
    },

    add: (entity) => {
        return db.add('category',entity);
    },

    update: (entity) => {
        return db.update('category','id',entity);
    },

    temporaryDelete: (id) => {
        return db.temporaryDelete('category', 'id', id);
    },


    delete: (id) => {
        return db.delete('category','id',id);
    }
}