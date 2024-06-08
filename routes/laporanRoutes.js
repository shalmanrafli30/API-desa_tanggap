const express = require('express');
const router = express.Router();
const laporanController = require('../controllers/laporanControllers');

router.get('/', laporanController.getAllLaporan);

module.exports = router;