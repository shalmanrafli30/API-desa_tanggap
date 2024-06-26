const model = require('../models/laporanModels');

exports.getAllLaporan = async (req, res) => {
    const [data] = await model.getAllLaporan();

    res.json({
        message:'GET all laporan success',
        data: data,
    })
};

exports.getLaporanMenunggu = async (req, res) => {
    const id_admin = req.id_admin;

    try {
        if (!id_admin) {
            throw new Error('id_admin is required');
        }

        const result = await model.getLaporanMenunggu(id_admin);

        if (result && result[0].length > 0) {
            res.status(200).json({ data: result[0] });
        } else {
            res.status(404).json({ error: 'No waiting reports found for the provided admin ID' });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
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
        const { judulLaporan, kategori, isiLaporan, lokasiLaporan } = req.body;
        if (!judulLaporan || !kategori || !isiLaporan || !lokasiLaporan) {
            return res.status(400).send({ message: 'Please provide all required fields.' });
        }

        // Add the new report using the model
        await model.addLaporan({ judulLaporan, kategori, isiLaporan, lokasiLaporan, id_user });

        // Send a success response
        res.status(201).send({ message: 'Report added successfully.' });
    } catch (error) {
        console.error('Error adding report:', error);
        res.status(500).send({ message: 'Internal server error.' });
    }
};

