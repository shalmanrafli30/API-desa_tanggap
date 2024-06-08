const db = require('../config/database');
const jwt = require('jsonwebtoken');

getAllLaporan = () => {
    const SQLQuery = 'SELECT * FROM report';
    return db.execute(SQLQuery);
}

const getUserLaporan = async (id_user) => {
    // Validate id_user
    if (!id_user) {
        throw new Error('id_user is required');
    }

    const SQLQuery = `SELECT * FROM report WHERE id_user = ?`;
    const [result] = await db.execute(SQLQuery, [id_user]);
    if (result.length === 0) {
        throw new Error('Laporan not found');
    }
    return result;
};

getDetailLaporanById = async (idLaporan) => {
    const SQLQuery = `SELECT * FROM report WHERE idLaporan = ?`;
    const [result] = await db.execute(SQLQuery, [idLaporan]);
    if (result.length === 0) {
        throw new Error('Laporan not found');
    }
    return result;
}

addLaporan = async ({ judulLaporan, isiLaporan, lokasiLaporan, id_user }) => {
    const SQLQuery = `
        INSERT INTO report (judulLaporan, isiLaporan, lokasiLaporan, id_user)
        VALUES (?, ?, ?, ?)
    `;
    await db.execute(SQLQuery, [judulLaporan, isiLaporan, lokasiLaporan, id_user]);
}

module.exports = {
    getAllLaporan,
    getDetailLaporanById,
    addLaporan,
    getUserLaporan,
}