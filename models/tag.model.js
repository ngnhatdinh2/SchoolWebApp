var db = require('../utils/db');

module.exports = {
    all: () => {
        return db.load('select * from tag');
    },
    allNotDeleted: () =>{
        return db.load('select * from tag where isdeleted = 0');
    },
    add:(entity)=> {
        return db.add('tag', entity);
    },

    update: (entity) => {
        return db.update('tag','id',entity);
    },
    single: (id)=>{
        return db.load(`select * from tag where id = ${id}`)
    },
    temporaryDelete: (id) => {
        return db.temporaryDelete('tag', 'id', id);
    },

    delete: (id) => {
        return db.delete('tag','id',id);
    }

}