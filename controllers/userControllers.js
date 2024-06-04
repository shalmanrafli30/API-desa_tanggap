// const bcrypt = require('bcrypt');
const model = require('../models/userModels');

exports.getAllUsers = async (req, res) => {
    const [data] = await model.getAllUsers();

    res.json({
        message:'GET all users success',
        data: data,
    })
};

exports.getUserById = async (req, res) => {
    try {
        const {id_user} = req.params;
        const [data] = await model.getUserById(id_user);
        
        res.json({
            message:`GET user data success`,
            data: data,
        })
    } catch (error) {
        console.error(error.message);
        res.status(500).json({error: 'Internal server error'})
    }
};

exports.addUser = async (req, res) => {
    const { body } = req;
    try {
        await model.addUser(body);
        res.json({
            message: 'Registrasi berhasil',
        });
    } catch (error) {
        let errorMessage = 'Internal server error';
        
        // Custom error messages based on different error types
        if (error.message.includes('required fields')) {
            errorMessage = 'Please provide all required fields: namaUser, username, email, and password';
        } else if (error.message.includes('already in use')) {
            errorMessage = 'Username or email already in use';
        } else if (error.message.includes('Invalid email format')) {
            errorMessage = 'Invalid email format';
        } else if (error.message.includes('Username must be between')) {
            errorMessage = 'Username must be between 3 and 20 characters and must not contain spaces';
        } else if (error.message.includes('Password must be at least')) {
            errorMessage = 'Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one digit, and one special character';
        }
        
        console.error(error.message);
        res.status(400).json({ error: errorMessage });
    }
};

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