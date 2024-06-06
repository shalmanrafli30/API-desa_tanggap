const express = require('express');
const router = express.Router();
const laporanController = require('../controllers/laporanControllers');

router.get('/', laporanController.getAllLaporan);
router.get('/idLaporan=:idLaporan', laporanController.getLaporanById);

module.exports = router;