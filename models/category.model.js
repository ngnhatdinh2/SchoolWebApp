var db = require('../utils/db');

module.exports = {
    allCateBig: () => {
        return db.load('select * from danh_muc where danh_muc_cha = null');
    },
    
    allCateSmall: () => {
        return db.load('select * from danh_muc where danh_muc_cha != null');
    },

    single: (id) =>{
        return db.load(`select * from danh_muc where ma_danh_muc = '${id}'`);
    },

    add: (entity) => {
        return db.add('danh_muc',entity);
    },

    update: (entity) => {
        return db.update('danh_muc','ma_danh_muc',entity);
    },

    delete: (id) => {
        return db.delete('danh_muc','ma_danh_muc',id);
    }
}