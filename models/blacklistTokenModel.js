const db = require('../config/database');

const addBlacklistToken = async (token) => {
    const query = 'INSERT INTO blacklist_tokens (token, createdAt) VALUES (?, NOW())';
    await db.execute(query, [token]);
};

const isTokenBlacklisted = async (token) => {
    const query = 'SELECT * FROM blacklist_tokens WHERE token = ?';
    const [rows] = await db.execute(query, [token]);
    return rows.length > 0;
};

module.exports = {
    addBlacklistToken,
    isTokenBlacklisted,
};
