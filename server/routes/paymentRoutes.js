import express from 'express';
import { createOrder, verifyPayment, getPaymentHistory, getAllPayments } from '../controllers/paymentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/create-order/:courseId', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.get('/history', protect, getPaymentHistory);
router.get('/all', protect, authorize('admin'), getAllPayments);

export default router;
