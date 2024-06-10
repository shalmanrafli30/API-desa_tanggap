const model = require('../models/adminModels');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');
const blacklistToken = require('../models/blacklistTokenModel');

exports.getAllAdmin = async (req, res) => {
    const [data] = await model.getAllAdmin();

    res.json({
        message:'GET all admin data success',
        data: data,
    })
};

exports.getAdminById = async (req, res) => {
    try {
        const { id_admin } = req.params;
        const data = await model.getAdminById(id_admin);
        
        res.json({
            message: 'GET admin data success',
            data: data,
        });
    } catch (error) {
        console.error(error.message);
        if (error.message.includes('Data not found')) {
            res.status(404).json({ error: 'Data not found' });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

exports.addAdmin = async (req, res) => {
    const { body } = req;
    try {
        await model.addAdmin(body);
        res.json({
            message: `Berhasil menambahkan admin: ${body.name}`,
        });
    } catch (error) {
        let errorMessage = 'Internal server error';
        
        // Custom error messages based on different error types
        if (error.message.includes('required fields')) {
            errorMessage = 'Please provide all required fields: name, bagian, username, and password';
        } else if (error.message.includes('already in use')) {
            errorMessage = 'Username or already in use';
        } else if (error.message.includes('Username must be between')) {
            errorMessage = 'Username must be between 3 and 20 characters and must not contain spaces';
        } else if (error.message.includes('Password must be at least')) {
            errorMessage = 'Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one digit, and one special character';
        }
        
        console.error(error.message);
        res.status(400).json({ error: errorMessage });
    }
};

exports.loginAdmin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const admin = await model.loginAdmin(username, password);
        // Generate token
        const token = jwt.sign({ id_admin: admin.id_admin, username: admin.username }, JWT_SECRET, {
            expiresIn: '1d'
        });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        // Handle errors
        res.status(401).json({ error: error.message });
    }
};

exports.logoutAdmin = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]; // Asumsi token dikirim dalam header Authorization

    try {
        // Simpan token ke dalam blacklist
        await blacklistToken.addBlacklistToken(token);

        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to logout user' });
    }
};