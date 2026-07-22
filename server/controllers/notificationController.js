import Notification from '../models/Notification.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50);
  const unreadCount = await Notification.countDocuments({ user: req.user._id, read: false });
  res.status(200).json({ success: true, notifications, unreadCount });
});

export const markAsRead = asyncHandler(async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { read: true });
  res.status(200).json({ success: true, message: 'Notification marked as read' });
});

export const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
  res.status(200).json({ success: true, message: 'All notifications marked as read' });
});

export const deleteNotification = asyncHandler(async (req, res) => {
  await Notification.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, message: 'Notification deleted' });
});

export const createNotification = async (userId, type, title, message, link = '') => {
  await Notification.create({ user: userId, type, title, message, link });
};

export const sendAnnouncement = asyncHandler(async (req, res) => {
  const { courseId, title, message } = req.body;
  const Course = (await import('../models/Course.js')).default;
  const course = await Course.findById(courseId);
  if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

  const notifications = course.enrolledStudents.map(studentId => ({
    user: studentId, type: 'announcement', title, message, link: `/courses/${courseId}`,
  }));

  await Notification.insertMany(notifications);
  res.status(200).json({ success: true, message: 'Announcement sent to all enrolled students' });
});
