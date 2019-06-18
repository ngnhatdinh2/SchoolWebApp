var mysql = require('mysql');
var createConnection = () => {
    return mysql.createConnection({
        host: '112.197.2.178',
        port: 3306,
        user: 'yan',
        database: 'newsdb'
    });
}

module.exports = {
    load: (sql) => {//xử lý đồng bộ - promise
        return new Promise((resolve, reject) => {
            var connection = createConnection();
            connection.connect(err => {
                console.log(err);
            });


            connection.query(sql, (error, results, fields) => {
                if (error) throw reject(error);
                else resolve(results);
                connection.end();
            });
        });
    },

    nextId: (tableName) => {//xử lý đồng bộ - promise
        return new Promise((resolve, reject) => {
            var connection = createConnection();
            connection.connect();

            var sql = `SELECT AUTO_INCREMENT FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'newsdb' AND TABLE_NAME = '${tableName}'`;
            connection.query(sql, (error, results, fields) => {
                if (error) throw reject(error);
                else resolve(results);
                connection.end();
            });
        });
    },

    add: (tableName, entity) => {
        return new Promise((resolve, reject) => {
            var connection = createConnection();
            connection.connect();
            delete entity['tags'];
            var sql = `INSERT INTO ${tableName} SET ?`;
            connection.query(sql, entity, (error, results, fields) => {
                if (error) throw reject(error);
                else resolve(results.insertId);//resolve(value.insertID) tự động tăng ID
                connection.end();
            });
        });
    },

    //INSERT INTO `post_tag` (`id`, `post_id`, `tag_id`, `isdeleted`) VALUES (NULL, '2', '6', ''), (NULL, '2', '7', '')

    multiAddForPostTag: (tableName, entities) => {
        if (entities.length==0) return;
        return new Promise((resolve, reject) => {
            var connection = createConnection();
            connection.connect();
            var sql = `INSERT INTO ${tableName} (id, post_id, tag_id, isdeleted) VALUES `;
            entities.forEach(item => {
                sql += `(NULL, ${item.post_id}, ${item.tag_id}, 0),`;
            })
            sql=sql.substr(0,sql.length-1);
            console.log(sql);
            connection.query(sql,(error,value)=>{
                if (error) throw reject(error);
                else resolve(value.changedRows);
                connection.end();
            })
        })
    },

    update: (tableName, idField, entity) => {
        return new Promise((resolve, reject) => {
            var connection = createConnection();
            connection.connect();
            var id = entity[idField];//gán giá trị ID
            delete entity[idField];//xóa giá trị ID trong json Category
            delete entity['tags'];
            var sql = `update ${tableName} SET ? WHERE ${idField} = ?`;
            connection.query(sql, [entity, id], (error, value) => {
                if (error) throw reject(error);
                else resolve(value.changedRows);//resolve(value.insertID) tự động tăng ID
                connection.end();
            });
        });
    },


    temporaryDelete: (tableName, idField, contentField) => {
        return new Promise((resolve, reject) => {
            var connection = createConnection();
            connection.connect();
            var sql = `update ${tableName} set isdeleted=1 where ${idField}=${contentField}`;
            connection.query(sql, (error, value) => {
                if (error) reject(error);
                else resolve(value.changedRows);
                connection.end();
            });
        });
    },


    delete: (tableName, idField, contentField) => {
        return new Promise((resolve, reject) => {
            var connection = createConnection();
            connection.connect();
            var sql = `delete from ${tableName} where ${idField} = ${contentField}`;
            connection.query(sql, (error, value) => {
                if (error) {
                    throw reject(error);
                }
                else resolve(value.affectedRows);//resolve(value.insertID) tự động tăng ID
                connection.end();
            });
        });
    }
};

