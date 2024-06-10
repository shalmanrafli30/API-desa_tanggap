const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControllers');
const laporanController = require('../controllers/laporanControllers');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/', userController.getAllUsers);
router.get('/id_user=:id_user', userController.getUserById);
router.post('/', userController.register);
router.patch('/edit-profil', authenticateToken.authenticateToken, userController.updateUser);
router.delete('/id_user=:id_user', userController.deleteUser);
router.post('/login', userController.loginUser);
router.post('/logout', authenticateToken.authenticateToken, userController.logoutUser);
router.post('/add-laporan', authenticateToken.authenticateToken, laporanController.addLaporan);
router.get('/laporan-saya', authenticateToken.authenticateToken, laporanController.getUserLaporan);

module.exports = router;