import Quiz from '../models/Quiz.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const createQuiz = asyncHandler(async (req, res) => {
  const { title, description, course, questions, duration, passingScore } = req.body;
  const quiz = await Quiz.create({ title, description, course, instructor: req.user._id, questions, duration, passingScore });
  res.status(201).json({ success: true, message: 'Quiz created', quiz });
});

export const getQuizzes = asyncHandler(async (req, res) => {
  const quizzes = await Quiz.find({ course: req.params.courseId }).select('-questions.options.isCorrect -attempts').sort({ createdAt: -1 });
  res.status(200).json({ success: true, quizzes });
});

export const getQuiz = asyncHandler(async (req, res, next) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) return next(new AppError('Quiz not found', 404));
  // Hide correct answers for students
  const q = quiz.toObject();
  if (req.user.role === 'student') {
    q.questions = q.questions.map(question => ({ ...question, options: question.options.map(o => ({ text: o.text, _id: o._id })) }));
  }
  res.status(200).json({ success: true, quiz: q });
});

export const updateQuiz = asyncHandler(async (req, res, next) => {
  let quiz = await Quiz.findById(req.params.id);
  if (!quiz) return next(new AppError('Quiz not found', 404));
  if (quiz.instructor.toString() !== req.user._id.toString()) return next(new AppError('Not authorized', 403));
  quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  res.status(200).json({ success: true, message: 'Quiz updated', quiz });
});

export const deleteQuiz = asyncHandler(async (req, res, next) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) return next(new AppError('Quiz not found', 404));
  await Quiz.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, message: 'Quiz deleted' });
});

export const submitQuiz = asyncHandler(async (req, res, next) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) return next(new AppError('Quiz not found', 404));

  const { answers } = req.body;
  let score = 0;

  answers.forEach(answer => {
    const question = quiz.questions[answer.questionIndex];
    if (!question) return;
    const correctOptions = question.options.map((o, i) => o.isCorrect ? i : -1).filter(i => i !== -1);
    const selected = answer.selectedOptions.sort();
    if (JSON.stringify(selected) === JSON.stringify(correctOptions.sort())) {
      score += question.points;
    }
  });

  const percentage = quiz.totalPoints > 0 ? Math.round((score / quiz.totalPoints) * 100) : 0;
  const passed = percentage >= quiz.passingScore;

  quiz.attempts.push({ student: req.user._id, answers, score, percentage, passed, completedAt: Date.now() });
  await quiz.save();

  res.status(200).json({ success: true, result: { score, totalPoints: quiz.totalPoints, percentage, passed } });
});

export const getLeaderboard = asyncHandler(async (req, res, next) => {
  const quiz = await Quiz.findById(req.params.id).populate('attempts.student', 'name avatar');
  if (!quiz) return next(new AppError('Quiz not found', 404));

  const leaderboard = quiz.attempts
    .sort((a, b) => b.percentage - a.percentage || a.completedAt - b.completedAt)
    .slice(0, 20)
    .map((a, i) => ({ rank: i + 1, student: a.student, score: a.score, percentage: a.percentage, completedAt: a.completedAt }));

  res.status(200).json({ success: true, leaderboard });
});

export const getMyAttempts = asyncHandler(async (req, res, next) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) return next(new AppError('Quiz not found', 404));
  const myAttempts = quiz.attempts.filter(a => a.student.toString() === req.user._id.toString());
  res.status(200).json({ success: true, attempts: myAttempts });
});
