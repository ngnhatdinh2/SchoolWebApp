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

    singleByEmail: (email) => {
        return db.load(`select * from user where email = '${email}'`);
    },

    add: (entity) => {
        return db.add('user', entity);
    },

    update: (entity) => {
        return db.update('user', 'id', entity);
    },

    updateByUsername: (entity) => {
        return db.update('user', 'username', entity);
    },

    temporaryDelete: (id) => {
        return db.temporaryDelete('user', 'id', id);
    },


    delete: (id) => {
        return db.delete('user', 'id', id);
    },

    nextId: () => {
        return db.nextId('user');
    },
}