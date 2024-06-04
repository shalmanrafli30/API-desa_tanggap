// const bcrypt = require('bcrypt');
const model = require('../models/userModels');

exports.getAllUsers = async (req, res) => {
    const [data] = await model.getAllUsers();

    res.json({
        message:'GET all users success',
        data: data,
    })
};

// exports.getUserById = (req, res) => {
//     connection.query(`SELECT * FROM user WHERE id_user = ${req.params.id_user}`, (err, rows, fields) => {
//         if (err) {
//             res.status(500).send({ error: 'Database query failed' });
//         } else if (rows.length === 0) {
//             res.status(404).send({ error: 'User not found' });
//         } else {
//             res.status(200).json(rows[0]);
//         }
//     });
// };

// exports.addUser = (req, res) => {
//     // Extract user data from request body
//     const { namaUser, email, username, password } = req.body;

//     // Validation (can be enhanced further)
//     if (!namaUser || !email || !username || !password) {
//         return res.status(400).send({ error: 'Please provide all required fields: namaUser, email, username, and password' });
//     }

//     // Email validation (basic check)
//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//         return res.status(400).send({ error: 'Kesalahan penulisan format email' });
//     }

//     // Username validation (basic check)
//     if (username.length < 3 || username.length > 20) {
//         return res.status(400).send({ error: 'Nama pengguna minimal 3 karakter dengan huruf (a-z), angka (0-9), titik (.), dan/atau garis bawah (_)' });
//     }

//     // Password validation (new requirements)
//     if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[._])\w{6,}$/.test(password)) {
//         return res.status(400).send({ error: 'Kata sandi minimal 6 karakter dengan huruf (a-z), angka (0-9), titik (.), dan/atau garis bawah (_)' });
//     }

//     // Hash password before storing
//     bcrypt.hash(password, 10, (err, hash) => {
//         if (err) {
//             return res.status(500).send({ error: 'Error hashing password' });
//         }
//       // Construct SQL query with prepared statements to prevent SQL injection
//         const sql = `INSERT INTO user (namaUser, email, username, password) VALUES (?, ?, ?, ?)`;
//         const values = [namaUser, email, username, hash];

//         connection.query(sql, values, (err, result) => {
//             if (err) {
//                 // Handle potential duplicate username or email errors more specifically
//                 if (err.code === 'ER_DUP_ENTRY') {
//                     return res.status(409).send({ error: 'Nama pengguna ataupun email sudah terpakai' });
//                 }
//                     return res.status(500).send({ error: 'Database error' });
//             }

//             // User created successfully
//             res.status(201).send({ message: 'Registrasi Berhasil!' });
//         });
//     });
// };

// exports.updateUser = (req, res) => {
//     // Extract user data from request body
//     const { namaUser, email} = req.body;
//     const id_user = req.params.id_user;
//     // Validation (can be enhanced further)
//     if (!namaUser || !email || !id_user) {
//         return res.status(400).send({ error: 'Please provide all required fields: namaUser, email, username, and password' });
//     }

//     // Email validation (basic check)
//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//         return res.status(400).send({ error: 'Kesalahan penulisan format email' });
//     }

//     // Username validation (basic check)
//     if (username.length < 3 || username.length > 20) {
//         return res.status(400).send({ error: 'Nama pengguna minimal 3 karakter dengan huruf (a-z), angka (0-9), titik (.), dan/atau garis bawah (_)' });
//     }

//     // Construct SQL query with prepared statements to prevent SQL injection
//     const sql = `UPDATE user SET namaUser = ?, email = ? WHERE id_user = ?`;
//     const values = [namaUser, email, id_user];

//     connection.query(sql, values, (err, result) => {
//         if (err) {
//             // Handle potential duplicate username or email errors more specifically
//             if (err.code === 'ER_DUP_ENTRY') {
//                 return res.status(409).send({ error: 'Nama pengguna ataupun email sudah terpakai' });
//             }
//                 return res.status(500).send({ error: 'Database error' });
//         }

//         // User created successfully
//         res.status(201).send({ message: 'Profil berhasil diperbarui!' });
//     });
// };

// exports.deleteUser = (req, res) => {
//     // Extract user ID from request parameter
//     const id_user = req.params.id_user;

//     // Validation (basic check)
//     if (!id_user) {
//         return res.status(400).send({ error: 'Please provide user ID' });
//     }

//     // Construct SQL query with prepared statements to prevent SQL injection
//     const sql = `DELETE FROM user WHERE id_user = ?`;
//     const value = id_user;

//     connection.query(sql, value, (err, result) => {
//         if (err) {
//             return res.status(500).send({ error: 'Database error' });
//         }

//       // Check if the user was deleted
//         if (result.affectedRows === 0) {
//             return res.status(404).send({ error: 'Data tidak ditemukan' });
//         }

//         // User deleted successfully
//         res.status(200).send({ message: 'Akun berhasil dihapus!' });
//     });
// };