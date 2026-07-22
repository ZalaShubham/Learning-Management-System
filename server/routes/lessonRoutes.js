import express from 'express';
import { createLesson, getLessons, getLesson, updateLesson, deleteLesson } from '../controllers/lessonController.js';
import { protect, authorize } from '../middleware/auth.js';
import { uploadAny } from '../config/multer.js';

const router = express.Router();

router.post('/:courseId', protect, authorize('instructor'), uploadAny.fields([{ name: 'video', maxCount: 1 }, { name: 'pdf', maxCount: 1 }, { name: 'attachments', maxCount: 5 }]), createLesson);
router.get('/:courseId', protect, getLessons);
router.get('/single/:id', protect, getLesson);
router.put('/:id', protect, authorize('instructor'), uploadAny.fields([{ name: 'video', maxCount: 1 }, { name: 'pdf', maxCount: 1 }]), updateLesson);
router.delete('/:id', protect, authorize('instructor'), deleteLesson);

export default router;
