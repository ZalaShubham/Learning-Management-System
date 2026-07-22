import Payment from '../models/Payment.js';
import Course from '../models/Course.js';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';

let razorpay;
const getRazorpayInstance = () => {
  if (!razorpay) {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || keyId === 'your_razorpay_key_id' || !keySecret || keySecret === 'your_razorpay_key_secret') {
      throw new Error('Razorpay credentials (RAZORPAY_KEY_ID/RAZORPAY_KEY_SECRET) are missing or not set in the .env file.');
    }
    razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }
  return razorpay;
};

export const createOrder = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) return next(new AppError('Course not found', 404));
  if (course.enrolledStudents.includes(req.user._id)) return next(new AppError('Already enrolled', 400));
  if (course.price === 0) return next(new AppError('This is a free course, enroll directly', 400));

  const instance = getRazorpayInstance();
  const options = { amount: course.price * 100, currency: 'INR', receipt: `receipt_${Date.now()}` };
  const order = await instance.orders.create(options);

  await Payment.create({ user: req.user._id, course: course._id, razorpayOrderId: order.id, amount: course.price, status: 'created' });

  res.status(200).json({ success: true, order, key: process.env.RAZORPAY_KEY_ID });
});

export const verifyPayment = asyncHandler(async (req, res, next) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(body).digest('hex');

  if (expectedSignature !== razorpay_signature) {
    await Payment.findOneAndUpdate({ razorpayOrderId: razorpay_order_id }, { status: 'failed' });
    return next(new AppError('Payment verification failed', 400));
  }

  const payment = await Payment.findOneAndUpdate(
    { razorpayOrderId: razorpay_order_id },
    { razorpayPaymentId: razorpay_payment_id, razorpaySignature: razorpay_signature, status: 'paid' },
    { new: true }
  );

  // Enroll student
  await Course.findByIdAndUpdate(payment.course, { $addToSet: { enrolledStudents: payment.user } });
  await User.findByIdAndUpdate(payment.user, { $push: { enrolledCourses: { course: payment.course, enrolledAt: Date.now() } } });

  res.status(200).json({ success: true, message: 'Payment successful', payment });
});

export const getPaymentHistory = asyncHandler(async (req, res) => {
  const payments = await Payment.find({ user: req.user._id }).populate('course', 'title thumbnail price').sort({ createdAt: -1 });
  res.status(200).json({ success: true, payments });
});

export const getAllPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find({ status: 'paid' }).populate('user', 'name email').populate('course', 'title price').sort({ createdAt: -1 });
  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
  res.status(200).json({ success: true, payments, totalRevenue });
});
