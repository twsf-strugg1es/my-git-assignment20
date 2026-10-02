const express = require('express');
const {
  register,
  login,
  logout,
  getMe,
  updateMe,
} = require('../controllers/userController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.patch('/me', protect, updateMe);

module.exports = router;