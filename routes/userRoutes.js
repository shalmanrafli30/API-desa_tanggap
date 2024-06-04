const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControllers');

router.get('/', userController.getAllUsers);
router.get('/:id_user', userController.getUserById);
router.post('/registrasi', userController.addUser);
router.patch('/edit/:id_user', userController.updateUser);

module.exports = router;