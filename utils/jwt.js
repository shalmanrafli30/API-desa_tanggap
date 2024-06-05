const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// Generate random secret key (gunakan ini hanya sekali untuk menghasilkan key)
const generateSecretKey = () => {
    return crypto.randomBytes(64).toString('hex');
};

// Simpan key yang dihasilkan di environment variable atau file konfigurasi yang aman
const secretKey = process.env.JWT_SECRET || generateSecretKey();

const generateToken = (user) => {
    const payload = {
        id_user: user.id_user,
        id_admin: user.id_admin,
        username: user.username,
        email: user.email
    };

    return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, secretKey);
    } catch (error) {
        return null;
    }
};

module.exports = {
    generateToken,
    verifyToken
};
