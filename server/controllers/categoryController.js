import Category from '../models/Category.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json({ success: true, message: 'Category created', category });
});

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  res.status(200).json({ success: true, categories });
});

export const updateCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!category) return next(new AppError('Category not found', 404));
  res.status(200).json({ success: true, message: 'Category updated', category });
});

export const deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) return next(new AppError('Category not found', 404));
  res.status(200).json({ success: true, message: 'Category deleted' });
});
