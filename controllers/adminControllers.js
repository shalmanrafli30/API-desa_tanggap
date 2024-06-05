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