const express = require('express');
const router = express.Router();
const { registerUser, loginUser, verifyEmail } = require('../controllers/authController');

// POST /register - Register a new user
router.post('/register', registerUser);

// POST /login - Login user
router.post('/login', loginUser);

// POST /verify - Verify email
router.post('/verify', verifyEmail);

module.exports = router;
