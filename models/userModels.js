const db = require('../config/database');

const getAllUsers = () => {
    const SQLQuery = 'SELECT * FROM user';
    return db.execute(SQLQuery);    
}

module.exports = {
    getAllUsers,
}