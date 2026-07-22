import User from '../models/User.js';
import Course from '../models/Course.js';
import Payment from '../models/Payment.js';
import Certificate from '../models/Certificate.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getAllUsers = asyncHandler(async (req, res) => {
  const { role, search, page = 1, limit = 20 } = req.query;
  const query = {};
  if (role) query.role = role;
  if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];

  const total = await User.countDocuments(query);
  const users = await User.find(query).select('-password').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
  res.status(200).json({ success: true, users, pagination: { total, page: Number(page), pages: Math.ceil(total / limit) } });
});

export const getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) return next(new AppError('User not found', 404));
  res.status(200).json({ success: true, user });
});

export const updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).select('-password');
  if (!user) return next(new AppError('User not found', 404));
  res.status(200).json({ success: true, message: 'User updated', user });
});

export const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return next(new AppError('User not found', 404));
  res.status(200).json({ success: true, message: 'User deleted' });
});

export const approveInstructor = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new AppError('User not found', 404));
  if (user.role !== 'instructor') return next(new AppError('User is not an instructor', 400));
  user.isApproved = true;
  await user.save();
  res.status(200).json({ success: true, message: 'Instructor approved' });
});

export const getDashboardStats = asyncHandler(async (req, res) => {
  const totalStudents = await User.countDocuments({ role: 'student' });
  const totalInstructors = await User.countDocuments({ role: 'instructor' });
  const totalCourses = await Course.countDocuments();
  const publishedCourses = await Course.countDocuments({ isPublished: true });
  const payments = await Payment.find({ status: 'paid' });
  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalCertificates = await Certificate.countDocuments();
  const pendingInstructors = await User.countDocuments({ role: 'instructor', isApproved: false });

  // Monthly stats (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const monthlyPayments = await Payment.aggregate([
    { $match: { status: 'paid', createdAt: { $gte: sixMonthsAgo } } },
    { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, revenue: { $sum: '$amount' }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);

  const monthlyEnrollments = await User.aggregate([
    { $unwind: '$enrolledCourses' },
    { $match: { 'enrolledCourses.enrolledAt': { $gte: sixMonthsAgo } } },
    { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$enrolledCourses.enrolledAt' } }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);

  res.status(200).json({
    success: true,
    stats: { totalStudents, totalInstructors, totalCourses, publishedCourses, totalRevenue, totalCertificates, pendingInstructors, monthlyPayments, monthlyEnrollments },
  });
});

export const getInstructorDashboard = asyncHandler(async (req, res) => {
  const courses = await Course.find({ instructor: req.user._id });
  const totalStudents = courses.reduce((sum, c) => sum + c.enrolledStudents.length, 0);
  const totalCourses = courses.length;

  const courseIds = courses.map(c => c._id);
  const payments = await Payment.find({ course: { $in: courseIds }, status: 'paid' });
  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

  const avgRating = courses.length ? courses.reduce((sum, c) => sum + c.ratings.average, 0) / courses.length : 0;

  res.status(200).json({
    success: true,
    stats: { totalCourses, totalStudents, totalRevenue, avgRating: Math.round(avgRating * 10) / 10, courses },
  });
});

export const getStudentDashboard = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({ path: 'enrolledCourses.course', populate: [{ path: 'instructor', select: 'name' }, { path: 'category', select: 'name' }] });

  const enrolled = user.enrolledCourses.length;
  const completed = user.enrolledCourses.filter(ec => ec.completed).length;
  const certificates = await Certificate.countDocuments({ student: req.user._id });
  const inProgress = enrolled - completed;

  res.status(200).json({
    success: true,
    stats: { enrolled, completed, inProgress, certificates, enrolledCourses: user.enrolledCourses },
  });
});
