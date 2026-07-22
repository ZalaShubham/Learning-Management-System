import Certificate from '../models/Certificate.js';
import Course from '../models/Course.js';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { v4 as uuidv4 } from 'uuid';

export const generateCertificate = asyncHandler(async (req, res, next) => {
  const { courseId } = req.params;
  const user = await User.findById(req.user._id);
  const enrollment = user.enrolledCourses.find(ec => ec.course.toString() === courseId);
  if (!enrollment) return next(new AppError('Not enrolled in this course', 400));
  if (!enrollment.completed) return next(new AppError('Course not completed yet', 400));

  const existing = await Certificate.findOne({ student: req.user._id, course: courseId });
  if (existing) return res.status(200).json({ success: true, certificate: existing });

  const certificate = await Certificate.create({
    student: req.user._id, course: courseId, certificateId: `CERT-${uuidv4().slice(0, 8).toUpperCase()}`,
  });

  res.status(201).json({ success: true, message: 'Certificate generated', certificate });
});

export const getMyCertificates = asyncHandler(async (req, res) => {
  const certificates = await Certificate.find({ student: req.user._id }).populate('course', 'title thumbnail instructor').populate({ path: 'course', populate: { path: 'instructor', select: 'name' } });
  res.status(200).json({ success: true, certificates });
});

export const verifyCertificate = asyncHandler(async (req, res, next) => {
  const certificate = await Certificate.findOne({ certificateId: req.params.certId }).populate('student', 'name email').populate('course', 'title');
  if (!certificate) return next(new AppError('Certificate not found', 404));
  res.status(200).json({ success: true, certificate });
});

export const getAllCertificates = asyncHandler(async (req, res) => {
  const certificates = await Certificate.find().populate('student', 'name email').populate('course', 'title').sort({ createdAt: -1 });
  res.status(200).json({ success: true, certificates });
});
