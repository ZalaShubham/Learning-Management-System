import express from 'express';
import { register, login, logout, getMe, verifyEmail, forgotPassword, resetPassword, updateProfile, changePassword } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { uploadImage } from '../config/multer.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.get('/verify-email/:token', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.put('/update-profile', protect, uploadImage.single('avatar'), updateProfile);
router.put('/change-password', protect, changePassword);

export default router;
