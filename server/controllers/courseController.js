import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';
import User from '../models/User.js';
import Review from '../models/Review.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryUpload.js';

// @desc    Create course
// @route   POST /api/courses
export const createCourse = asyncHandler(async (req, res) => {
  const { title, description, category, level, price, tags, requirements, whatYouWillLearn } = req.body;

  let thumbnail = { url: '', public_id: '' };

  if (req.file) {
    const result = await uploadToCloudinary(req.file.path, 'thumbnails');
    thumbnail = { public_id: result.public_id, url: result.secure_url };
  }

  const course = await Course.create({
    title,
    description,
    category,
    level,
    price,
    instructor: req.user._id,
    thumbnail,
    tags: tags ? JSON.parse(tags) : [],
    requirements: requirements ? JSON.parse(requirements) : [],
    whatYouWillLearn: whatYouWillLearn ? JSON.parse(whatYouWillLearn) : [],
  });

  res.status(201).json({
    success: true,
    message: 'Course created successfully',
    course,
  });
});

// @desc    Get all courses (public)
// @route   GET /api/courses
export const getCourses = asyncHandler(async (req, res) => {
  const { search, category, level, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query;

  const query = { isPublished: true };

  // Search
  if (search) {
    query.$text = { $search: search };
  }

  // Filters
  if (category) query.category = category;
  if (level) query.level = level;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  // Sort
  let sortOption = { createdAt: -1 };
  if (sort === 'price-low') sortOption = { price: 1 };
  if (sort === 'price-high') sortOption = { price: -1 };
  if (sort === 'rating') sortOption = { 'ratings.average': -1 };
  if (sort === 'popular') sortOption = { 'enrolledStudents': -1 };

  const total = await Course.countDocuments(query);
  const courses = await Course.find(query)
    .populate('instructor', 'name avatar')
    .populate('category', 'name')
    .sort(sortOption)
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  res.status(200).json({
    success: true,
    courses,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      limit: Number(limit),
    },
  });
});

// @desc    Get single course
// @route   GET /api/courses/:id
export const getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id)
    .populate('instructor', 'name avatar bio')
    .populate('category', 'name')
    .populate('lessons');

  if (!course) {
    return next(new AppError('Course not found', 404));
  }

  // Get reviews
  const reviews = await Review.find({ course: req.params.id })
    .populate('user', 'name avatar')
    .sort({ createdAt: -1 })
    .limit(10);

  res.status(200).json({
    success: true,
    course,
    reviews,
  });
});

// @desc    Update course
// @route   PUT /api/courses/:id
export const updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);

  if (!course) {
    return next(new AppError('Course not found', 404));
  }

  // Check ownership
  if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to update this course', 403));
  }

  const updateData = { ...req.body };

  if (updateData.tags && typeof updateData.tags === 'string') {
    updateData.tags = JSON.parse(updateData.tags);
  }
  if (updateData.requirements && typeof updateData.requirements === 'string') {
    updateData.requirements = JSON.parse(updateData.requirements);
  }
  if (updateData.whatYouWillLearn && typeof updateData.whatYouWillLearn === 'string') {
    updateData.whatYouWillLearn = JSON.parse(updateData.whatYouWillLearn);
  }

  if (req.file) {
    if (course.thumbnail && course.thumbnail.public_id) {
      await deleteFromCloudinary(course.thumbnail.public_id);
    }
    const result = await uploadToCloudinary(req.file.path, 'thumbnails');
    updateData.thumbnail = { public_id: result.public_id, url: result.secure_url };
  }

  course = await Course.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: 'Course updated successfully',
    course,
  });
});

// @desc    Delete course
// @route   DELETE /api/courses/:id
export const deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(new AppError('Course not found', 404));
  }

  if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to delete this course', 403));
  }

  // Delete thumbnail
  if (course.thumbnail && course.thumbnail.public_id) {
    await deleteFromCloudinary(course.thumbnail.public_id);
  }

  // Delete associated lessons
  await Lesson.deleteMany({ course: req.params.id });

  await Course.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Course deleted successfully',
  });
});

// @desc    Publish/Unpublish course
// @route   PUT /api/courses/:id/publish
export const togglePublish = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(new AppError('Course not found', 404));
  }

  if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('Not authorized', 403));
  }

  course.isPublished = !course.isPublished;
  await course.save();

  res.status(200).json({
    success: true,
    message: `Course ${course.isPublished ? 'published' : 'unpublished'} successfully`,
    isPublished: course.isPublished,
  });
});

// @desc    Get instructor's courses
// @route   GET /api/courses/instructor/my-courses
export const getInstructorCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({ instructor: req.user._id })
    .populate('category', 'name')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    courses,
  });
});

// @desc    Enroll in course
// @route   POST /api/courses/:id/enroll
export const enrollCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(new AppError('Course not found', 404));
  }

  // Check if already enrolled
  const isEnrolled = course.enrolledStudents.includes(req.user._id);
  if (isEnrolled) {
    return next(new AppError('Already enrolled in this course', 400));
  }

  // Add student to course
  course.enrolledStudents.push(req.user._id);
  await course.save();

  // Add course to user's enrolled courses
  await User.findByIdAndUpdate(req.user._id, {
    $push: {
      enrolledCourses: {
        course: course._id,
        enrolledAt: Date.now(),
      },
    },
  });

  res.status(200).json({
    success: true,
    message: 'Enrolled successfully',
  });
});

// @desc    Get enrolled courses
// @route   GET /api/courses/enrolled
export const getEnrolledCourses = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: 'enrolledCourses.course',
    populate: [
      { path: 'instructor', select: 'name avatar' },
      { path: 'category', select: 'name' },
    ],
  });

  res.status(200).json({
    success: true,
    enrolledCourses: user.enrolledCourses,
  });
});

// @desc    Update lesson progress
// @route   PUT /api/courses/:courseId/progress/:lessonId
export const updateProgress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const courseIndex = user.enrolledCourses.findIndex(
    (ec) => ec.course.toString() === req.params.courseId
  );

  if (courseIndex === -1) {
    return res.status(400).json({ success: false, message: 'Not enrolled in this course' });
  }

  const enrolledCourse = user.enrolledCourses[courseIndex];

  // Add lesson to completed if not already
  if (!enrolledCourse.completedLessons.includes(req.params.lessonId)) {
    enrolledCourse.completedLessons.push(req.params.lessonId);
  }

  // Calculate progress
  const course = await Course.findById(req.params.courseId);
  const totalLessons = course.lessons.length;
  const completedLessons = enrolledCourse.completedLessons.length;

  enrolledCourse.progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  // Check if completed
  if (enrolledCourse.progress === 100) {
    enrolledCourse.completed = true;
    enrolledCourse.completedAt = Date.now();
  }

  await user.save();

  res.status(200).json({
    success: true,
    progress: enrolledCourse.progress,
    completed: enrolledCourse.completed,
  });
});
