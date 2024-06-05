const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControllers');

router.get('/', userController.getAllUsers);
router.get('/id_user=:id_user', userController.getUserById);
router.post('/', userController.addUser);
router.patch('/id_user=:id_user', userController.updateUser);
router.delete('/id_user=:id_user', userController.deleteUser);
router.post('/login', userController.loginUser);

module.exports = router;