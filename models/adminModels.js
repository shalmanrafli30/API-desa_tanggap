const db = require('../config/database');
const bcrypt = require('bcrypt');

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

const addAdmin = async (body) => {
    const { name, bagian, username, password } = body;

    // Validation checks
    if (!name || !bagian || !username || !password) {
        throw new Error('Please provide all required fields: name, bagian, username, and password');
    }

    // Check if username or email already exist
    const [existingUser] = await db.execute(`SELECT * FROM admin WHERE username = ?`, [username]);
    if (existingUser.length > 0) {
        throw new Error('Username or email already in use');
    }

    // Username validation
    if (username.length < 3 || username.length > 20 || /\s/.test(username)) {
        throw new Error('Username must be between 3 and 20 characters and must not contain spaces');
    }

    // Password validation
    if (password.length < 8 || !/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+[\]{}|;:',.<>/?]).{8,}/.test(password)) {
        throw new Error('Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one digit, and one special character');
    }

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into the database
    const SQLQuery =    `INSERT INTO admin (name, bagian, username, password)
                        VALUES (?, ?, ?, ?)`;
    const values = [name, bagian, username, hashedPassword];

    return db.execute(SQLQuery, values);
};
module.exports = {
    getAllAdmin,
    getAdminById,
    addAdmin
}