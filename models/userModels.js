const db = require('../config/database');
const bcrypt = require('bcrypt');
const { generateToken } = require('../jwt');

const getAllUsers = () => {
    const SQLQuery = 'SELECT * FROM user';
    return db.execute(SQLQuery);    
}

const getUserById = async (id_user) => {
    const SQLQuery = `SELECT * FROM user WHERE id_user = ?`;
    const [result] = await db.execute(SQLQuery, [id_user]);
    if (result.length === 0) {
        throw new Error('User not found');
    }
    return result;
};

const addUser = async (body) => {
    const { fullName, username, email, password } = body;

    // Validation checks
    if (!fullName || !username || !email || !password) {
        throw new Error('Please provide all required fields: fullName, username, email, and password');
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
    const SQLQuery =    `INSERT INTO user (fullName, username, email, password)
                        VALUES (?, ?, ?, ?)`;
    const values = [fullName, username, email, hashedPassword];

    return db.execute(SQLQuery, values);
};

const updateUser = async (id_user, fullName, password, address) => {
    if (!id_user) {
        throw new Error('Please provide the user ID');
    }

    if (password && (password.length < 8 || !/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+[\]{}|;:',.<>/?]).{8,}/.test(password))) {
        throw new Error('Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one digit, and one special character');
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    let SQLQuery = 'UPDATE user SET';
    const values = [];

    if (fullName) {
        SQLQuery += ' fullName = ?,';
        values.push(fullName);
    }

    if (address) {
        SQLQuery += ' address = ?,';
        values.push(address);
    }

    if (hashedPassword) {
        SQLQuery += ' password = ?,';
        values.push(hashedPassword);
    }
    
    SQLQuery = SQLQuery.replace(/,$/, ' WHERE id_user = ?');
    values.push(id_user);

    try {
        const [result] = await db.execute(SQLQuery, values);
        return result.affectedRows > 0;
    } catch (error) {
        throw new Error('Database error');
    }
};

const deleteUser = (id_user) => {
    const SQLQuery = `DELETE FROM user WHERE id_user = ${id_user}`
    return db.execute(SQLQuery);
}

const loginUser = async (username, password) => {
    if (!username || !password) {
        throw new Error('Please provide both username and password');
    }

    const [users] = await db.execute(`SELECT * FROM user WHERE username = ?`, [username]);
    if (users.length === 0) {
        throw new Error('Invalid username or password');
    }

    const user = users[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid username or password');
    }

    const token = generateToken(user);
    return { token, user: { id_user: user.id_user, username: user.username, email: user.email, fullName: user.fullName } };
};

module.exports = {
    getAllUsers,
    getUserById,
    addUser,
    updateUser,
    deleteUser,
    loginUser,
}