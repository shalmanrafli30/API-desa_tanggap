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

exports.updateUser = async (req, res) => {
    const { id_user } = req.params;
    const { namaUser, password } = req.body;

    try {
        const result = await model.updateUser(id_user, namaUser, password);

        if (result) {
            res.status(200).json({ message: 'User updated successfully' });
        } else {
            res.status(404).json({ error: 'User not found or no changes applied' });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

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