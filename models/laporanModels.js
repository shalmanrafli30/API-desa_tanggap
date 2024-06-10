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

const addLaporan = async ({ judulLaporan, isiLaporan, lokasiLaporan, id_user }) => {
    const connection = await db.getConnection();

    try {
        // Mulai transaksi
        await connection.beginTransaction();

        // Tambahkan laporan ke tabel report
        const insertReportQuery = `
            INSERT INTO report (judulLaporan, isiLaporan, lokasiLaporan, id_user)
            VALUES (?, ?, ?, ?)
        `;
        const [reportResult] = await connection.execute(insertReportQuery, [judulLaporan, isiLaporan, lokasiLaporan, id_user]);

        // Ambil idLaporan yang baru ditambahkan
        const idLaporan = reportResult.insertId;

        // Tambahkan progres ke tabel progres_laporan
        const insertProgresQuery = `
            INSERT INTO progres_laporan (idLaporan, deskripsiProgres, status)
            VALUES (?, ?, ?)
        `;
        const deskripsi = 'Laporan diterima oleh bagian bla bla';
        const status = 'MENUNGGU';
        await connection.execute(insertProgresQuery, [idLaporan, deskripsi, status]);

        // Commit transaksi
        await connection.commit();
    } catch (error) {
        // Rollback transaksi jika ada kesalahan
        await connection.rollback();
        throw error;
    } finally {
        // Pastikan koneksi ditutup setelah operasi selesai
        connection.release();
    }
};


module.exports = {
    getAllLaporan,
    getDetailLaporanById,
    addLaporan,
    getUserLaporan,
}