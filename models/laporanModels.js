const db = require('../config/database');
const jwt = require('jsonwebtoken');

getAllLaporan = () => {
    const SQLQuery = 'SELECT * FROM report';
    return db.execute(SQLQuery);
}

const getLaporanMenunggu = async (id_admin) => {
    if (!id_admin) {
        throw new Error('id_admin is required');
    }

    const SQLQuery = `  SELECT r.* 
                        FROM report r 
                        JOIN progres_laporan p ON r.idLaporan = p.idLaporan
                        WHERE p.id_admin = ? AND r.status = ?
                        ORDER BY r.idLaporan DESC`;

    const status = "MENUNGGU";
    return db.execute(SQLQuery, [id_admin, status]);
};


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

const addLaporan = async ({ judulLaporan, kategori, isiLaporan, lokasiLaporan, id_user }) => {
    const connection = await db.getConnection();

    try {
        // Mulai transaksi
        await connection.beginTransaction();

        // Tambahkan laporan ke tabel report
        const insertReportQuery = `
            INSERT INTO report (judulLaporan, kategori, isiLaporan, lokasiLaporan, id_user)
            VALUES (?, ?, ?, ?, ?)
        `;
        const [reportResult] = await connection.execute(insertReportQuery, [judulLaporan, kategori, isiLaporan, lokasiLaporan, id_user]);

        // Ambil idLaporan yang baru ditambahkan
        const idLaporan = reportResult.insertId;

        // Tambahkan progres ke tabel progres_laporan
        const insertProgresQuery = `
            INSERT INTO progres_laporan (idLaporan, id_admin, deskripsiProgres, status)
            VALUES (?, ?, ?, ?)
        `;

        let id_admin = '0000';
        let deskripsi = 'Laporan diterima oleh bagian bla bla';
        if (kategori === 'Kebersihan' || kategori === 'Fasilitas Umum') {
            id_admin = '2000';
            deskripsi = 'Laporan diterima oleh Seksi Ekonomi dan Pembangunan';
        } else if (kategori === 'Lalu Lintas' || kategori === 'Keamanan') {
            id_admin = '2001';
            deskripsi = 'Laporan diterima oleh Seksi Transportasi dan Ketertiban';
        }
        const status = 'MENUNGGU';
        await connection.execute(insertProgresQuery, [idLaporan, id_admin, deskripsi, status]);

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
    getLaporanMenunggu,
}