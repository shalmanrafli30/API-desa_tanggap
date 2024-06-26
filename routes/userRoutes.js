const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControllers');
const laporanController = require('../controllers/laporanControllers');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/', userController.getAllUsers);
router.get('/profil', authenticateToken.authenticateToken, userController.getUserById);
router.post('/register', userController.register);
router.patch('/edit-profil', authenticateToken.authenticateToken, userController.updateUser);
router.delete('/delete', authenticateToken.authenticateToken, userController.deleteUser);
router.post('/login', userController.loginUser);
router.post('/logout', authenticateToken.authenticateToken, userController.logoutUser);
router.post('/add-laporan', authenticateToken.authenticateToken, laporanController.addLaporan);
router.get('/laporan-saya', authenticateToken.authenticateToken, laporanController.getUserLaporan);

module.exports = router;