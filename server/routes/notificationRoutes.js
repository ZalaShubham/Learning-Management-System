import express from 'express';
import { getNotifications, markAsRead, markAllAsRead, deleteNotification, sendAnnouncement } from '../controllers/notificationController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getNotifications);
router.put('/:id/read', protect, markAsRead);
router.put('/mark-all-read', protect, markAllAsRead);
router.delete('/:id', protect, deleteNotification);
router.post('/announcement', protect, authorize('instructor'), sendAnnouncement);

export default router;
