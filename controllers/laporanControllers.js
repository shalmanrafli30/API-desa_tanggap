const model = require('../models/laporanModels');

exports.getAllLaporan = async (req, res) => {
    const [data] = await model.getAllLaporan();

    res.json({
        message:'GET all laporan success',
        data: data,
    })
};

exports.getLaporanById = async (req, res) => {
    try {
        const { idLaporan } = req.params;
        const data = await model.getLaporanById(idLaporan);

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
}