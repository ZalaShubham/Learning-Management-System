import express from 'express';
import { createReview, getReviews, updateReview, deleteReview } from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/:courseId', protect, createReview);
router.get('/:courseId', getReviews);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

export default router;
