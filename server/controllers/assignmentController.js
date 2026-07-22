import Assignment from '../models/Assignment.js';
import Submission from '../models/Submission.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { uploadToCloudinary } from '../utils/cloudinaryUpload.js';

export const createAssignment = asyncHandler(async (req, res) => {
  const { title, description, course, dueDate, totalMarks } = req.body;
  const attachments = [];
  if (req.files) {
    for (const file of req.files) {
      const r = await uploadToCloudinary(file.path, 'assignments', 'raw');
      attachments.push({ name: file.originalname, public_id: r.public_id, url: r.secure_url });
    }
  }
  const assignment = await Assignment.create({ title, description, course, instructor: req.user._id, dueDate, totalMarks, attachments });
  res.status(201).json({ success: true, message: 'Assignment created', assignment });
});

export const getAssignments = asyncHandler(async (req, res) => {
  const assignments = await Assignment.find({ course: req.params.courseId }).populate('instructor', 'name').sort({ createdAt: -1 });
  res.status(200).json({ success: true, assignments });
});

export const getAssignment = asyncHandler(async (req, res, next) => {
  const assignment = await Assignment.findById(req.params.id).populate('instructor', 'name');
  if (!assignment) return next(new AppError('Assignment not found', 404));
  res.status(200).json({ success: true, assignment });
});

export const updateAssignment = asyncHandler(async (req, res, next) => {
  let assignment = await Assignment.findById(req.params.id);
  if (!assignment) return next(new AppError('Assignment not found', 404));
  if (assignment.instructor.toString() !== req.user._id.toString()) return next(new AppError('Not authorized', 403));
  assignment = await Assignment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  res.status(200).json({ success: true, message: 'Assignment updated', assignment });
});

export const deleteAssignment = asyncHandler(async (req, res, next) => {
  const assignment = await Assignment.findById(req.params.id);
  if (!assignment) return next(new AppError('Assignment not found', 404));
  await Assignment.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, message: 'Assignment deleted' });
});

export const submitAssignment = asyncHandler(async (req, res, next) => {
  if (!req.file) return next(new AppError('Please upload a file', 400));
  const r = await uploadToCloudinary(req.file.path, 'submissions', 'raw');
  const submission = await Submission.create({
    assignment: req.params.id, student: req.user._id,
    file: { public_id: r.public_id, url: r.secure_url, name: req.file.originalname },
  });
  res.status(201).json({ success: true, message: 'Assignment submitted', submission });
});

export const getSubmissions = asyncHandler(async (req, res) => {
  const submissions = await Submission.find({ assignment: req.params.id }).populate('student', 'name email avatar');
  res.status(200).json({ success: true, submissions });
});

export const gradeSubmission = asyncHandler(async (req, res, next) => {
  const { marks, feedback } = req.body;
  const submission = await Submission.findByIdAndUpdate(req.params.id, { marks, feedback, status: 'graded', gradedAt: Date.now() }, { new: true });
  if (!submission) return next(new AppError('Submission not found', 404));
  res.status(200).json({ success: true, message: 'Submission graded', submission });
});
