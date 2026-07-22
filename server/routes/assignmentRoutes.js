import express from 'express';
import { createAssignment, getAssignments, getAssignment, updateAssignment, deleteAssignment, submitAssignment, getSubmissions, gradeSubmission } from '../controllers/assignmentController.js';
import { protect, authorize } from '../middleware/auth.js';
import { uploadDocument } from '../config/multer.js';

const router = express.Router();

router.post('/', protect, authorize('instructor'), uploadDocument.array('attachments', 5), createAssignment);
router.get('/course/:courseId', protect, getAssignments);
router.get('/:id', protect, getAssignment);
router.put('/:id', protect, authorize('instructor'), updateAssignment);
router.delete('/:id', protect, authorize('instructor'), deleteAssignment);
router.post('/:id/submit', protect, authorize('student'), uploadDocument.single('file'), submitAssignment);
router.get('/:id/submissions', protect, authorize('instructor'), getSubmissions);
router.put('/submissions/:id/grade', protect, authorize('instructor'), gradeSubmission);

export default router;
