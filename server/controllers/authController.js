import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { generateToken, generateVerificationToken, generateResetToken } from '../utils/generateToken.js';
import { sendVerificationEmail, sendResetPasswordEmail } from '../services/emailService.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryUpload.js';
import jwt from 'jsonwebtoken';

// @desc    Register user
// @route   POST /api/auth/register
export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('Email already registered', 400));
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role === 'instructor' ? 'instructor' : 'student',
    isApproved: role === 'instructor' ? false : true,
  });

  // Generate verification token
  const verificationToken = generateVerificationToken(user._id);

  try {
    await sendVerificationEmail(user, verificationToken);
  } catch (error) {
    console.error('Email sending failed:', error);
  }

  const token = generateToken(user._id);

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(201).json({
    success: true,
    message: 'Registration successful. Please check your email to verify your account.',
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      isVerified: user.isVerified,
      isApproved: user.isApproved,
    },
  });
});

// @desc    Login user
// @route   POST /api/auth/login
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new AppError('Invalid email or password', 401));
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return next(new AppError('Invalid email or password', 401));
  }

  if (user.role === 'instructor' && !user.isApproved) {
    return next(new AppError('Your instructor account is pending approval', 403));
  }

  const token = generateToken(user._id);

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    message: 'Login successful',
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      isVerified: user.isVerified,
      isApproved: user.isApproved,
      bio: user.bio,
      phone: user.phone,
    },
  });
});

// @desc    Logout user
// @route   POST /api/auth/logout
export const logout = asyncHandler(async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});

// @desc    Get current user
// @route   GET /api/auth/me
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('enrolledCourses.course', 'title thumbnail');

  res.status(200).json({
    success: true,
    user,
  });
});

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
export const verifyEmail = asyncHandler(async (req, res, next) => {
  try {
    const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET);

    if (decoded.purpose !== 'email-verification') {
      return next(new AppError('Invalid verification token', 400));
    }

    const user = await User.findByIdAndUpdate(
      decoded.id,
      { isVerified: true },
      { new: true }
    );

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
    });
  } catch (error) {
    return next(new AppError('Invalid or expired verification token', 400));
  }
});

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
export const forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError('No account found with that email', 404));
  }

  const resetToken = generateResetToken(user._id);

  try {
    await sendResetPasswordEmail(user, resetToken);
    res.status(200).json({
      success: true,
      message: 'Password reset email sent',
    });
  } catch (error) {
    return next(new AppError('Email could not be sent', 500));
  }
});

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:token
export const resetPassword = asyncHandler(async (req, res, next) => {
  try {
    const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET);

    if (decoded.purpose !== 'password-reset') {
      return next(new AppError('Invalid reset token', 400));
    }

    const user = await User.findById(decoded.id).select('+password');

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    user.password = req.body.password;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successful',
    });
  } catch (error) {
    return next(new AppError('Invalid or expired reset token', 400));
  }
});

// @desc    Update profile
// @route   PUT /api/auth/update-profile
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, bio, phone } = req.body;

  const updateData = {};
  if (name) updateData.name = name;
  if (bio !== undefined) updateData.bio = bio;
  if (phone !== undefined) updateData.phone = phone;

  if (req.file) {
    // Delete old avatar if exists
    if (req.user.avatar && req.user.avatar.public_id) {
      await deleteFromCloudinary(req.user.avatar.public_id);
    }

    const result = await uploadToCloudinary(req.file.path, 'avatars');
    updateData.avatar = {
      public_id: result.public_id,
      url: result.secure_url,
    };
  }

  const user = await User.findByIdAndUpdate(req.user._id, updateData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    user,
  });
});

// @desc    Change password
// @route   PUT /api/auth/change-password
export const changePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    return next(new AppError('Current password is incorrect', 400));
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password changed successfully',
  });
});
