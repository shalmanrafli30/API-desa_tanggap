// const bcrypt = require('bcrypt');
const model = require('../models/userModels');
const jwt = require('jsonwebtoken');
const blacklistToken = require('../models/blacklistTokenModel');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

exports.getAllUsers = async (req, res) => {
    const [data] = await model.getAllUsers();

    res.json({
        message:'GET all users success',
        data: data,
    })
};

exports.getUserById = async (req, res) => {
    try {
        const id_user = req.id_user;
        const data = await model.getUserById(id_user);
        
        res.json({
            message: 'GET user data success',
            data: data,
        });
    } catch (error) {
        console.error(error.message);
        if (error.message.includes('User not found')) {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

exports.register = async (req, res) => {
    const { body } = req;
    try {
        await model.register(body);
        res.json({
            message: 'Registrasi berhasil',
        });
    } catch (error) {
        let errorMessage = 'Internal server error';
        
        // Custom error messages based on different error types
        if (error.message.includes('required fields')) {
            errorMessage = 'Please provide all required fields: fullName, username, email, and password';
        } else if (error.message.includes('already in use')) {
            errorMessage = 'Username or email already in use';
        } else if (error.message.includes('Invalid email format')) {
            errorMessage = 'Invalid email format';
        } else if (error.message.includes('Username must be between')) {
            errorMessage = 'Username must be between 3 and 20 characters and must not contain spaces';
        } else if (error.message.includes('Password must be at least')) {
            errorMessage = 'Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one digit, and one special character';
        }
        
        console.error(error.message);
        res.status(400).json({ error: errorMessage });
    }
};

exports.updateUser = async (req, res) => {
    const id_user = req.id_user;
    console.log('ID User:', id_user);
    const { fullName, password, address } = req.body;

    try {
        const result = await model.updateUser(id_user, fullName, password, address);

        if (result) {
            res.status(200).json({ message: 'User updated successfully' });
        } else {
            res.status(404).json({ error: 'User not found or no changes applied' });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.deleteUser = async (req, res) => {
    const {id_user} = req.params;
    try {
        await model.deleteUser(id_user);
        res.json ({
            message: 'Delete user success',
            data: null
        })
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await model.loginUser(username, password);
        // Generate token
        const token = jwt.sign({ id_user: user.id_user, username: user.username }, JWT_SECRET, {
            expiresIn: '1d'
        });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        // Handle errors
        res.status(401).json({ error: error.message });
    }
};

exports.logoutUser = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]; // Asumsi token dikirim dalam header Authorization

    try {
        // Simpan token ke dalam blacklist
        await blacklistToken.addBlacklistToken(token);

        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to logout user' });
    }
};
