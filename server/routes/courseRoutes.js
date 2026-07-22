import express from 'express';
import { createCourse, getCourses, getCourse, updateCourse, deleteCourse, togglePublish, getInstructorCourses, enrollCourse, getEnrolledCourses, updateProgress } from '../controllers/courseController.js';
import { protect, authorize } from '../middleware/auth.js';
import { uploadImage } from '../config/multer.js';

const router = express.Router();

router.get('/', getCourses);
router.get('/enrolled', protect, getEnrolledCourses);
router.get('/instructor/my-courses', protect, authorize('instructor'), getInstructorCourses);
router.get('/:id', getCourse);
router.post('/', protect, authorize('instructor', 'admin'), uploadImage.single('thumbnail'), createCourse);
router.put('/:id', protect, authorize('instructor', 'admin'), uploadImage.single('thumbnail'), updateCourse);
router.delete('/:id', protect, authorize('instructor', 'admin'), deleteCourse);
router.put('/:id/publish', protect, authorize('instructor', 'admin'), togglePublish);
router.post('/:id/enroll', protect, enrollCourse);
router.put('/:courseId/progress/:lessonId', protect, updateProgress);

export default router;
