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
            connection.connect(err=>{
                console.log(err);
            });
            

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
            var sql = `INSERT INTO ${tableName} SET ?`;
            connection.query(sql, entity, (error, results, fields) => {
                if (error) throw reject(error);
                else resolve(results);//resolve(value.insertID) tự động tăng ID
                connection.end();
            });
        });
    },

    update: (tableName, idField, entity) => {
        return new Promise((resolve, reject) => {
            var connection = createConnection();
            connection.connect();
            var id = entity[idField];//gán giá trị ID
            delete entity[idField];//xóa giá trị ID trong json Category
            var sql = `update ${tableName} SET ? WHERE ${idField} = ?`;
            connection.query(sql, [entity, id], (error, value) => {
                if (error) throw reject(error);
                else resolve(value.changedRows);//resolve(value.insertID) tự động tăng ID
                connection.end();
            });
        });
    },


    temporaryDelete: (tableName, idField, contentField) => {
        return new Promise((resolve,reject) => {
            var connection = createConnection();
            connection.connect();
            var sql = `update ${tableName} set isdeleted=1 where ${idField}=${contentField}`;
            connection.query(sql,(error,value)=>{
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
            var sql = `delete from ${tableName} where ${idField} = ?`;
            connection.query(sql, contentField, (error, value) => {
                if (error) throw reject(error);
                else resolve(value.affectedRows);//resolve(value.insertID) tự động tăng ID
                connection.end();
            });
        });
    }
};

