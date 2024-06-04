const db = require('../config/database');

const getAllUsers = () => {
    const SQLQuery = 'SELECT * FROM user';
    return db.execute(SQLQuery);    
}

const getUserById = (id_user) => {
    const SQLQuery = `SELECT * FROM user WHERE id_user = ${id_user}`;
    return db.execute(SQLQuery);
}

module.exports = {
    getAllUsers,
    getUserById,
}