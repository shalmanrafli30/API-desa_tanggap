const db = require('../config/database');

getAllLaporan = () => {
    const SQLQuery = 'SELECT * FROM report';
    return db.execute(SQLQuery);
}

getLaporanById = async (idLaporan) => {
    const SQLQuery = `SELECT * FROM report WHERE idLaporan = ?`;
    const [result] = await db.execute(SQLQuery, [idLaporan]);
    if (result.length === 0) {
        throw new Error('Laporan not found');
    }
    return result;
}

const addLaporan = async (req, res) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).send({ message: 'No token provided.' });
    }

    try {
        // Decode the token to get the user information
        const decoded = jwt.verify(token, secret);
        const id_user = decoded.id_user; // Ensure your token contains `id_user`

        // Extract the report details from the request body
        const { judulLaporan, isiLaporan, lokasiLaporan } = req.body;
        if (!judulLaporan || !isiLaporan || !lokasiLaporan) {
            return res.status(400).send({ message: 'Please provide all required fields.' });
        }

        // SQL query to insert the new report
        const SQLQuery = `
            INSERT INTO report (judulLaporan, isiLaporan, lokasiLaporan, id_user)
            VALUES (?, ?, ?, ?)
        `;
        
        // Execute the query
        await db.execute(SQLQuery, [judulLaporan, isiLaporan, lokasiLaporan, id_user]);

        // Send a success response
        res.status(201).send({ message: 'Report added successfully.' });
    } catch (error) {
        console.error('Error adding report:', error);
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).send({ message: 'Invalid or expired token.' });
        }
        res.status(500).send({ message: 'Internal server error.' });
    }
};

module.exports = {
    getAllLaporan,
    getLaporanById,
}