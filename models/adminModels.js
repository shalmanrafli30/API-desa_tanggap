const db = require('../config/database');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/jwt');

const getAllAdmin = () => {
    const SQLQuery = 'SELECT * FROM admin';
    return db.execute(SQLQuery);    
}

const getAdminById = async (id_admin) => {
    const SQLQuery = `SELECT * FROM admin WHERE id_admin = ?`;
    const [result] = await db.execute(SQLQuery, [id_admin]);
    if (result.length === 0) {
        throw new Error('Data not found');
    }
    return result;
};

module.exports = {
    getAllAdmin,
    getAdminById,
}