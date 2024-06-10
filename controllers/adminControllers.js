const model = require('../models/adminModels');

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