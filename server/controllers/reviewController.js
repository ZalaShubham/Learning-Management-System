import Review from '../models/Review.js';
import Course from '../models/Course.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const createReview = asyncHandler(async (req, res, next) => {
  const { rating, comment } = req.body;
  const courseId = req.params.courseId;

  const existing = await Review.findOne({ user: req.user._id, course: courseId });
  if (existing) return next(new AppError('You have already reviewed this course', 400));

  const review = await Review.create({ user: req.user._id, course: courseId, rating, comment });

  // Update course ratings
  const reviews = await Review.find({ course: courseId });
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  await Course.findByIdAndUpdate(courseId, { ratings: { average: Math.round(avg * 10) / 10, count: reviews.length } });

  res.status(201).json({ success: true, message: 'Review added', review });
});

export const getReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ course: req.params.courseId }).populate('user', 'name avatar').sort({ createdAt: -1 });
  res.status(200).json({ success: true, reviews });
});

export const updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);
  if (!review) return next(new AppError('Review not found', 404));
  if (review.user.toString() !== req.user._id.toString()) return next(new AppError('Not authorized', 403));

  review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

  // Recalculate ratings
  const reviews = await Review.find({ course: review.course });
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  await Course.findByIdAndUpdate(review.course, { ratings: { average: Math.round(avg * 10) / 10, count: reviews.length } });

  res.status(200).json({ success: true, message: 'Review updated', review });
});

export const deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) return next(new AppError('Review not found', 404));
  await Review.findByIdAndDelete(req.params.id);

  const reviews = await Review.find({ course: review.course });
  const avg = reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
  await Course.findByIdAndUpdate(review.course, { ratings: { average: Math.round(avg * 10) / 10, count: reviews.length } });

  res.status(200).json({ success: true, message: 'Review deleted' });
});
