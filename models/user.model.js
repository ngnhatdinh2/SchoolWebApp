var db = require('../utils/db');

module.exports = {
    all: () => {
        return db.load('select * from user');
    },

    single: (id) => {
        return db.load(`select * from user where id = '${id}'`);
    },

    singleByUsername: (username) => {
        return db.load(`select * from user where username = '${username}'`);
    },

    add: (entity) => {
        return db.add('user', entity);
    },

    update: (entity) => {
        return db.update('user', 'id', entity);
    },
    temporaryDelete: (id) => {
        return db.temporaryDelete('user', 'id', id);
    },
    getSubscriber: ()=>{
        return db.load(`select * from user where role = 1 and isdeleted = 0`); //order by id limit '${limit}' offset '${offset}
    },
    getEditor: ()=>{
        return db.load(`select * from user where role = 2 and isdeleted = 0`);
    },
    getWritter: ()=>{
        return db.load(`select * from user where role = 3 and isdeleted = 0`);
    },
    getGuest: () => {
        return db.load(`select * from user where role = 5 and isdeleted = 0`);
    },
    delete: (id) => {
        return db.delete('user', 'id', id);
    }
}