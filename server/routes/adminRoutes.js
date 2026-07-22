import express from 'express';
import { getAllUsers, getUser, updateUser, deleteUser, approveInstructor, getDashboardStats, getInstructorDashboard, getStudentDashboard } from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/users', protect, authorize('admin'), getAllUsers);
router.get('/users/:id', protect, authorize('admin'), getUser);
router.put('/users/:id', protect, authorize('admin'), updateUser);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);
router.put('/approve-instructor/:id', protect, authorize('admin'), approveInstructor);
router.get('/dashboard', protect, authorize('admin'), getDashboardStats);
router.get('/instructor-dashboard', protect, authorize('instructor'), getInstructorDashboard);
router.get('/student-dashboard', protect, getStudentDashboard);

export default router;
