var db = require('../utils/db');

module.exports = {
    all: () => {
        return db.load('select * from posts order by id DESC');
    },

    allWithDetails: () => {
        return db.load('SELECT p.id, p.title, p.publish_date, p.abstract_body, p.full_body, p.thumbnail_url,p.image_url,p.status,p.view,p.user_id,p.category_id,p.isdeleted, cate.name as topic, user.name as author FROM posts p JOIN category cate ON p.category_id = cate.id JOIN user ON p.user_id = user.id order by p.id DESC');
    },

    allByCate: (idCate) => {
        return db.load(`select * from posts where category_id = ${idCate} order by id DESC`);
    },

    allByCate: (idCate, offset, limit, ispremium) => {
        var sql = `select p.*, c.name as category_name from(select * from posts where category_id = ${idCate}`;
        sql += ispremium == false ? `and ispremium=0` : ``;
        sql += `limit ${offset},${limit}) p, category c where p.category_id = c.id`;
        return db.load(sql);
    },

    postLimit: (offset, limit) => {
        return db.load(`select * from posts limit ${offset},${limit} order by id DESC`);
    },

    postRelative: (id, idCate) => {
        return db.load(`SELECT p.id, p.title, p.publish_date, p.abstract_body, p.full_body, p.thumbnail_url,p.image_url,p.status,p.view,p.user_id,p.category_id,p.isdeleted, cate.name as topic, user.name as author FROM posts p JOIN category cate ON p.category_id = cate.id JOIN user ON p.user_id = user.id WHERE p.id != ${id} and cate.id = ${idCate} order by p.id DESC LIMIT 5`);
    },

    postLimitWittCategoryName: (offset, limit, ispremium) => {
        var sql = `select p.* , c.name as category_name from (SELECT * FROM posts where ispremium=0 ORDER BY posts.publish_date desc limit ${offset},${limit}) p, category c where p.category_id = c.id`;
        if (ispremium == true)
            sql = `select p.* , c.name as category_name from (SELECT * FROM posts ORDER BY posts.ispremium desc, posts.publish_date desc limit ${offset},${limit}) p, category c where p.category_id = c.id`;
        return db.load(sql);
    },

    postLimit: (offset, limit) => {
        return db.load(`select * from posts limit ${offset},${limit}`);
    },

    mostViewPost: (offset, limit) => {
        return db.load(`select p.* , c.name as category_name from posts p, category c where p.category_id = c.id ORDER BY p.view DESC LIMIT ${offset},${limit}`);
    },

    getDirect: (cateId) => {
        return db.load(`select DISTINCT cg.name as cg_name, c.name as c_name from categorygroup cg, category c, posts p WHERE c.categorygroup_id = cg.id and c.id = ${cateId}`);
    },

    allByTag: (tagId, offset, limit, ispremium) => {
        var sql = `select p.*, t.id as tag_id, t.name as tag_name from posts p, tag t, post_tag WHERE p.id = post_tag.post_id and t.id = post_tag.tag_id and post_tag.tag_id = ${tagId} `;
        sql+= ispremium==false? ` and ispremium=0 `:``;
        sql+=`ORDER BY p.ispremium desc, p.publish_date desc limit ${offset},${limit}`;
        console.log(sql);
        return db.load(sql);
    },

    countPostByCate: (ispremium , cateID = null) => {
        var sql = `select count(*) as numb_of_posts from posts where `;
        sql += cateID != null ? `posts.category_id = ${cateID} ` : `1 `;
        sql += ispremium == false ? `and ispremium=0` : ``;
        console.log(sql);
        console.log(sql);
        return db.load(sql);
    },

    countPostByTag: (ispremium,tagID = null) => {
        var sql = `SELECT count(post_id) as numb_of_posts from post_tag where `;
        sql += tagID != null ? `post_tag.tag_id=${tagID} ` : `1`;
        console.log(sql);
        return db.load(sql);
    },



    postLimit: (offset, limit) => {
        return db.load(`select * from posts limit ${offset},${limit} order by id DESC`);
    },

    single: id => {
        return db.load(`SELECT p.id, p.title, p.publish_date, p.abstract_body, p.full_body, p.thumbnail_url,p.image_url,p.status,p.view,p.user_id,p.category_id,p.isdeleted, cate.name as topic, user.name as author FROM posts p JOIN category cate ON p.category_id = cate.id JOIN user ON p.user_id = user.id WHERE p.id = ${id}`);
    },


    add: (entity) => {
        return db.add('posts', entity);
    },

    update: (entity) => {
        return db.update('posts', 'id', entity);
    },

    temporaryDelete: (id) => {
        return db.temporaryDelete('posts', 'id', id);
    },


    delete: (id) => {
        return db.delete('posts', 'id', id);
    },

    allByUserIdAndStatus: (user_id, status = null) => {
        var sql = `select p.*, c.name as category_name from (SELECT * from posts where user_id = ${user_id}) p, category c where p.category_id = c.id`;
        sql += status != null ? ` and status = ${status}` : ``;
        return db.load(sql);
    }

}