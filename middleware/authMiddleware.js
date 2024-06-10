const jwt = require('jsonwebtoken');
const blacklistModel = require('../models/blacklistTokenModel');

exports.authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token not provided' });
    }

    const blacklisted = await blacklistModel.isTokenBlacklisted(token);
    if (blacklisted) {
        return res.status(403).json({ error: 'Token has been blacklisted' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.id_user = decoded.id_user; // Store user ID for future use
        next(); // Proceed to the next middleware or route handler
    });
};

exports.authenticateTokenAdmin = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token not provided' });
    }

    const blacklisted = await blacklistModel.isTokenBlacklisted(token);
    if (blacklisted) {
        return res.status(403).json({ error: 'Token has been blacklisted' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.id_user = decoded.id_user; // Store user ID for future use
        next(); // Proceed to the next middleware or route handler
    });
};
