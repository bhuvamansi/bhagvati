import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import User from '../models/User.js';
import { AppError } from './errorHandler.js';

const extractBearerToken = (req) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    return req.headers.authorization.split(' ')[1];
  }
  return null;
};

// =========================
// Protect Admin Routes
// =========================
export const protectAdmin = async (req, res, next) => {
  try {
    const token =
      req.cookies?.adminToken ||
      req.cookies?.token ||
      extractBearerToken(req);

    if (!token) {
      return next(new AppError('Admin authentication required.', 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.type !== 'admin') {
      return next(new AppError('Invalid admin token.', 401));
    }

    const admin = await Admin.findById(decoded.id).select('-password');

    if (!admin) {
      return next(new AppError('Admin account no longer exists.', 401));
    }

    if (admin.isActive === false) {
      return next(new AppError('Admin account is inactive.', 403));
    }

    req.admin = admin;
    next();
  } catch (error) {
    return next(new AppError('Invalid or expired admin token.', 401));
  }
};

// =========================
// Protect User Routes
// =========================
export const protectUser = async (req, res, next) => {
  try {
    const token =
      req.cookies?.userToken ||
      extractBearerToken(req);

    if (!token) {
      return next(new AppError('Please log in to continue.', 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.type !== 'user') {
      return next(new AppError('Invalid user token.', 401));
    }

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return next(new AppError('User account no longer exists.', 401));
    }

    if (user.isActive === false) {
      return next(new AppError('User account is inactive.', 403));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new AppError('Invalid or expired user token.', 401));
  }
};

// =========================
// Authorize Admin Roles
// =========================
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.admin || !roles.includes(req.admin.role)) {
      return next(
        new AppError('You do not have permission to perform this action.', 403)
      );
    }
    next();
  };
};