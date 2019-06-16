var db = require('../utils/db');

module.exports = {
    all: () => {
        return db.load('select * from categorygroup');
    },

    add:(entity)=> {
        return db.add('categorygroup', entity);
    },

    update: (entity) => {
        return db.update('categorygroup','id',entity);
    },

    temporaryDelete: (id) => {
        return db.temporaryDelete('categorygroup', 'id', id);
    },


    delete: (id) => {
        return db.delete('categorygroup','id',id);
    }

}