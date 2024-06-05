const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminControllers');

router.get('/', adminController.getAllAdmin);
router.get('/id_admin=:id_admin', adminController.getAdminById);

module.exports = router;