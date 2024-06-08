const db = require('../config/database');
const jwt = require('jsonwebtoken');

getAllLaporan = () => {
    const SQLQuery = 'SELECT * FROM report';
    return db.execute(SQLQuery);
}

showDetailLaporanById = async (idLaporan) => {
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
    showDetailLaporanById,
    addLaporan,
}