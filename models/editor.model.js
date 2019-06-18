var db = require('../utils/db');

module.exports = {
    all: () => {
        return db.load('select * from editor');
    },
    selectByEditor: (editor_id)=>{
        return db.load(`select * from editor where user_id = ${editor_id} limit 1`);
    }
}