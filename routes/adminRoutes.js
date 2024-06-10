const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminControllers');
const laporanController = require('../controllers/laporanControllers');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/', adminController.getAllAdmin);
router.get('/id_admin=:id_admin', adminController.getAdminById);
router.post('/', adminController.addAdmin);
router.post('/login', adminController.loginAdmin);
router.post('/logout', authenticateToken.authenticateTokenAdmin, adminController.logoutAdmin);
router.post('/terima-laporan/idLaporan=:idLaporan', authenticateToken.authenticateTokenAdmin, adminController.terimaLaporan);
router.post('/tolak-laporan/idLaporan=:idLaporan', authenticateToken.authenticateTokenAdmin, adminController.tolakLaporan);
router.get('/laporan-menunggu', authenticateToken.authenticateTokenAdmin, laporanController.getLaporanMenunggu);

module.exports = router;