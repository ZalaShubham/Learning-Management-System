import express from 'express';
import { createQuiz, getQuizzes, getQuiz, updateQuiz, deleteQuiz, submitQuiz, getLeaderboard, getMyAttempts } from '../controllers/quizController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, authorize('instructor'), createQuiz);
router.get('/course/:courseId', protect, getQuizzes);
router.get('/:id', protect, getQuiz);
router.put('/:id', protect, authorize('instructor'), updateQuiz);
router.delete('/:id', protect, authorize('instructor'), deleteQuiz);
router.post('/:id/submit', protect, authorize('student'), submitQuiz);
router.get('/:id/leaderboard', protect, getLeaderboard);
router.get('/:id/my-attempts', protect, getMyAttempts);

export default router;
