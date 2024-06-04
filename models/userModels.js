const db = require('../config/database');
const bcrypt = require('bcrypt');

const getAllUsers = () => {
    const SQLQuery = 'SELECT * FROM user';
    return db.execute(SQLQuery);    
}

const getUserById = (id_user) => {
    const SQLQuery = `SELECT * FROM user WHERE id_user = ${id_user}`;
    return db.execute(SQLQuery);
}

const addUser = async (body) => {
    const { namaUser, username, email, password } = body;

    // Validation checks
    if (!namaUser || !username || !email || !password) {
        throw new Error('Please provide all required fields: namaUser, username, email, and password');
    }

    // Check if username or email already exist
    const [existingUser] = await db.execute(`SELECT * FROM user WHERE username = ? OR email = ?`, [username, email]);
    if (existingUser.length > 0) {
        throw new Error('Username or email already in use');
    }

    // Email validation (basic check)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error('Invalid email format');
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
    const SQLQuery =    `INSERT INTO user (namaUser, username, email, password)
                        VALUES (?, ?, ?, ?)`;
    const values = [namaUser, username, email, hashedPassword];

    return db.execute(SQLQuery, values);
};

module.exports = {
    getAllUsers,
    getUserById,
    addUser,
}