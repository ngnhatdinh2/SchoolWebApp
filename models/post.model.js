var db = require('../utils/db');

module.exports = {
    all: () => {
        return db.load('select * from posts order by id DESC');
    },

    allByCate: (idCate) => {
        return db.load(`select * from posts where category_id = ${idCate} order by id DESC`);
    },

    allByCate: (idCate, offset, limit) => {
        return db.load(`select p.*, c.name as category_name from(select * from posts where category_id = ${idCate} limit ${offset},${limit}) p, category c where p.category_id = c.id`)
    },

    mostViewPost: (offset,limit) => {
        return db.load(`select p.* , c.name as category_name from posts p, category c where p.category_id = c.id ORDER BY p.view DESC LIMIT ${offset},${limit}`);
    },

    postLimitWittCategoryName: (offset,limit) => {
        return db.load(`select p.* , c.name as category_name from (select * from posts order by posts.publish_date desc limit ${offset},${limit}) p, category c where p.category_id = c.id`)
    },


    postLimit: (offset, limit) => {
        return db.load(`select * from posts limit ${offset},${limit}`);
    },

    add: (entity) => {
        return db.add('post', entity);
    },

    getDirect: (cateId) => {
        return db.load(`select DISTINCT cg.name as cg_name, c.name as c_name from categorygroup cg, category c, posts p WHERE c.categorygroup_id = cg.id and c.id = ${cateId}`);
    },

    allByTag: (tagId, offset, limit) => {
        return db.load(`select p.*, t.id as tag_id, t.name as tag_name from posts p, tag t, post_tag WHERE p.id = post_tag.post_id and t.id = post_tag.tag_id and post_tag.tag_id = ${tagId} limit ${offset},${limit}`);
    },

    countPostByCate: (cateID=null) => {
        var sql = `select count(*) as numb_of_posts from posts`;
        sql += cateID != null ? ` where posts.category_id = ${cateID}`: `` ;
        return db.load(sql);
    }, 
    
    countPostByTag: (tagID=null)=> {
        var sql = `SELECT count(post_id) as numb_of_posts from post_tag`;
        sql += tagID != null ? ` WHERE post_tag.tag_id=${tagID}`: `` ;
        return db.load(sql);    
    },

    temporaryDelete: (id) => {
        return db.temporaryDelete('post', 'id', id);
    },
    
    postLimit: (offset, limit) => {
        return db.load(`select * from posts limit ${offset},${limit} order by id DESC` );
    },


    update: (entity) => {
        return db.update('posts', 'id', entity);
    },

   


    delete: (id) => {
        return db.delete('post', 'id', id);
    }

}