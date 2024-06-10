const db = require('../config/database');
const bcrypt = require('bcrypt');
const laporan = require('../controllers/laporanControllers');

const getAllAdmin = () => {
    const SQLQuery = 'SELECT * FROM admin';
    return db.execute(SQLQuery);    
}

const getAdminById = async (id_admin) => {
    const SQLQuery = `SELECT * FROM admin WHERE id_admin = ?`;
    const [result] = await db.execute(SQLQuery, [id_admin]);
    if (result.length === 0) {
        throw new Error('Data not found');
    }
    return result;
};

const addAdmin = async (body) => {
    const { name, bagian, username, password } = body;

    // Validation checks
    if (!name || !bagian || !username || !password) {
        throw new Error('Please provide all required fields: name, bagian, username, and password');
    }

    // Check if username or email already exist
    const [existingUser] = await db.execute(`SELECT * FROM admin WHERE username = ?`, [username]);
    if (existingUser.length > 0) {
        throw new Error('Username or email already in use');
    }

    // Username validation
    if (username.length < 3 || username.length > 20 || /\s/.test(username)) {
        throw new Error('Username must be between 3 and 20 characters and must not contain spaces');
    }

    // Password validation
    if (password.length < 8 || !/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+[\]{}|;:',.<>/?]).{8,}/.test(password)) {
        throw new Error('Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one digit, and one special character');
    }

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into the database
    const SQLQuery =    `INSERT INTO admin (name, bagian, username, password)
                        VALUES (?, ?, ?, ?)`;
    const values = [name, bagian, username, hashedPassword];

    return db.execute(SQLQuery, values);
};

const loginAdmin = async (username, password) => {
    if (!username || !password) {
        throw new Error('Please provide both username and password');
    }

    const [users] = await db.execute(`SELECT * FROM admin WHERE username = ?`, [username]);
    if (users.length === 0) {
        throw new Error('Invalid username');
    }

    const user = users[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid password');
    }

    return user;
};

const terimaLaporan = async (idLaporan, id_admin, namaAdmin) => {
    if (!idLaporan) {
        throw new Error('Laporan tidak ditemukan');
    }

    const deskripsi = `Laporan diproses oleh ${namaAdmin}`;
    const status = 'DIPROSES';

    // Query untuk menyimpan laporan
    const TerimaSQLQuery = `INSERT INTO progres_laporan (idLaporan, id_admin, deskripsiProgres, status) VALUES (?, ?, ?, ?)`;
    const values = [idLaporan, id_admin, deskripsi, status];
    
    try {
        // Eksekusi query menyimpan laporan
        await db.execute(TerimaSQLQuery, values);

        // Query untuk mengupdate status laporan
        const updateSQLQuery = `UPDATE report SET status = ? WHERE idLaporan = ?`;
        const valuesUpdate = [status, idLaporan];

        // Eksekusi query update status laporan
        await db.execute(updateSQLQuery, valuesUpdate);

        // Mengembalikan pesan sukses
        return { success: true, message: 'Laporan diterima dan status berhasil diperbarui' };
    } catch (error) {
        // Tangani kesalahan yang mungkin terjadi selama eksekusi query
        console.error('Error in terimaLaporan:', error.message);
        throw new Error('Terjadi kesalahan saat memproses laporan');
    }
};

const tolakLaporan = async (idLaporan, id_admin, namaAdmin) => {
    if (!idLaporan) {
        throw new Error('Laporan tidak ditemukan');
    }

    const deskripsi = `Laporan ditolak oleh ${namaAdmin}`;
    const status = 'DITOLAK';

    // Query untuk menyimpan laporan
    const TerimaSQLQuery = `INSERT INTO progres_laporan (idLaporan, id_admin, deskripsiProgres, status) VALUES (?, ?, ?, ?)`;
    const values = [idLaporan, id_admin, deskripsi, status];
    
    try {
        // Eksekusi query menyimpan laporan
        await db.execute(TerimaSQLQuery, values);

        // Query untuk mengupdate status laporan
        const updateSQLQuery = `UPDATE report SET status = ? WHERE idLaporan = ?`;
        const valuesUpdate = [status, idLaporan];

        // Eksekusi query update status laporan
        await db.execute(updateSQLQuery, valuesUpdate);

        // Mengembalikan pesan sukses
        return { success: true, message: 'Laporan ditolak dan status berhasil diperbarui' };
    } catch (error) {
        // Tangani kesalahan yang mungkin terjadi selama eksekusi query
        console.error('Error in terimaLaporan:', error.message);
        throw new Error('Terjadi kesalahan saat memproses laporan');
    }
};

module.exports = {
    getAllAdmin,
    getAdminById,
    addAdmin,
    loginAdmin,
    terimaLaporan,
    tolakLaporan,
}