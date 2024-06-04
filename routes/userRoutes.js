const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControllers');

router.get('/', userController.getAllUsers);
router.get('/:id_user', userController.getUserById);

module.exports = router;