const express = require('express');
const router = express.Router();
const { registerUser, loginUser, verifyEmail, forgotPassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-email/:token', verifyEmail);
router.post('/forgot-password', forgotPassword);

// Example protected route for testing
router.get('/profile', protect, (req, res) => {
    res.json(req.user);
});

module.exports = router;
