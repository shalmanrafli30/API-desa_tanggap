const model = require('../models/laporanModels');

exports.getAllLaporan = async (req, res) => {
    const [data] = await model.getAllLaporan();

    res.json({
        message:'GET all laporan success',
        data: data,
    })
};

exports.getUserLaporan = async (req, res) => {
    try {
        const id_user = req.id_user; // Use the user ID from the authenticated token

        // Validate id_user
        if (!id_user) {
            return res.status(400).json({ error: 'id_user is required' });
        }

        const data = await model.getUserLaporan(id_user);

        res.json({
            message: 'GET laporan success',
            data: data,
        });
    } catch (error) {
        console.error(error.message);
        if (error.message.includes('Laporan not found')) {
            res.status(404).json({ error: 'Laporan not found' });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

exports.getDetailLaporanById = async (req, res) => {
    try {
        const { idLaporan } = req.params;
        const data = await model.getDetailLaporanById(idLaporan);

        res.json({
            message: 'GET laporan success',
            data: data,
        });
    } catch (error) {
        console.error(error.message);
        if (error.message.includes('Laporan not found')) {
            res.status(404).json({ error: 'Laporan not found' });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

exports.addLaporan = async (req, res) => {
    try {
        // Extract the user ID from the authenticated request
        const id_user = req.id_user;
        console.log('ID User:', id_user); // Add this line for debugging

        // Extract the report details from the request body
        const { judulLaporan, isiLaporan, lokasiLaporan } = req.body;
        if (!judulLaporan || !isiLaporan || !lokasiLaporan) {
            return res.status(400).send({ message: 'Please provide all required fields.' });
        }

        // Add the new report using the model
        await model.addLaporan({ judulLaporan, isiLaporan, lokasiLaporan, id_user });

        // Send a success response
        res.status(201).send({ message: 'Report added successfully.' });
    } catch (error) {
        console.error('Error adding report:', error);
        res.status(500).send({ message: 'Internal server error.' });
    }
};
