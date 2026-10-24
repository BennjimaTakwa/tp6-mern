const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

// Public routes
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

// Protected routes
router.get('/profile', protect, userController.getUserProfile);
router.put('/update-password', protect, userController.updatePassword);
router.get('/', protect, adminOnly, userController.getAllUsers);
router.put('/:id/role', protect, adminOnly, userController.updateUserRole);
router.get('/:id', userController.getUserById);
router.delete('/:id', userController.deleteUser);

module.exports = router;
