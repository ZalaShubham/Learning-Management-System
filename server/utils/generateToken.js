import jwt from 'jsonwebtoken';

export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

export const generateVerificationToken = (userId) => {
  return jwt.sign({ id: userId, purpose: 'email-verification' }, process.env.JWT_SECRET, {
    expiresIn: '24h',
  });
};

export const generateResetToken = (userId) => {
  return jwt.sign({ id: userId, purpose: 'password-reset' }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};
