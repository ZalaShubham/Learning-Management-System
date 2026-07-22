import Lesson from '../models/Lesson.js';
import Course from '../models/Course.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryUpload.js';

export const createLesson = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) return next(new AppError('Course not found', 404));
  if (course.instructor.toString() !== req.user._id.toString()) return next(new AppError('Not authorized', 403));

  const { title, description, duration, isFreePreview } = req.body;
  const lessonData = { title, description, duration, course: course._id, order: course.lessons.length + 1, isFreePreview: isFreePreview === 'true' };

  if (req.files?.video) {
    const r = await uploadToCloudinary(req.files.video[0].path, 'videos', 'video');
    lessonData.video = { public_id: r.public_id, url: r.secure_url, duration: r.duration };
  }
  if (req.files?.pdf) {
    const r = await uploadToCloudinary(req.files.pdf[0].path, 'documents', 'raw');
    lessonData.pdf = { public_id: r.public_id, url: r.secure_url };
  }

  const lesson = await Lesson.create(lessonData);
  course.lessons.push(lesson._id);
  await course.save();

  res.status(201).json({ success: true, message: 'Lesson added', lesson });
});

export const getLessons = asyncHandler(async (req, res) => {
  const lessons = await Lesson.find({ course: req.params.courseId }).sort({ order: 1 });
  res.status(200).json({ success: true, lessons });
});

export const getLesson = asyncHandler(async (req, res, next) => {
  const lesson = await Lesson.findById(req.params.id);
  if (!lesson) return next(new AppError('Lesson not found', 404));
  res.status(200).json({ success: true, lesson });
});

export const updateLesson = asyncHandler(async (req, res, next) => {
  let lesson = await Lesson.findById(req.params.id);
  if (!lesson) return next(new AppError('Lesson not found', 404));
  const updateData = { ...req.body };
  if (req.files?.video) {
    if (lesson.video?.public_id) await deleteFromCloudinary(lesson.video.public_id, 'video');
    const r = await uploadToCloudinary(req.files.video[0].path, 'videos', 'video');
    updateData.video = { public_id: r.public_id, url: r.secure_url };
  }
  if (req.files?.pdf) {
    if (lesson.pdf?.public_id) await deleteFromCloudinary(lesson.pdf.public_id, 'raw');
    const r = await uploadToCloudinary(req.files.pdf[0].path, 'documents', 'raw');
    updateData.pdf = { public_id: r.public_id, url: r.secure_url };
  }
  lesson = await Lesson.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
  res.status(200).json({ success: true, message: 'Lesson updated', lesson });
});

export const deleteLesson = asyncHandler(async (req, res, next) => {
  const lesson = await Lesson.findById(req.params.id);
  if (!lesson) return next(new AppError('Lesson not found', 404));
  if (lesson.video?.public_id) await deleteFromCloudinary(lesson.video.public_id, 'video');
  if (lesson.pdf?.public_id) await deleteFromCloudinary(lesson.pdf.public_id, 'raw');
  await Course.findByIdAndUpdate(lesson.course, { $pull: { lessons: lesson._id } });
  await Lesson.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, message: 'Lesson deleted' });
});
