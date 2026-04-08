import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import Admin from '../models/Admin.js';
import User from '../models/User.js';
import DeliveryBoy from '../models/DeliveryBoy.js';
import { AppError } from '../middleware/errorHandler.js';

const signToken = (payload) => {
  if (!process.env.JWT_SECRET) {
    throw new AppError('JWT_SECRET is not configured.', 500);
  }

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const cookieDays = parseInt(process.env.COOKIE_EXPIRES_DAYS || '7', 10) || 7;

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: cookieDays * 24 * 60 * 60 * 1000,
    path: '/',
  };
};

const comparePasswordFlexible = async (enteredPassword, storedPassword) => {
  if (!enteredPassword || !storedPassword) return false;

  if (enteredPassword === storedPassword) {
    return true;
  }

  try {
    return await bcrypt.compare(enteredPassword, storedPassword);
  } catch {
    return false;
  }
};

const sanitizeAdmin = (admin) => ({
  _id: admin._id,
  name: admin.name,
  email: admin.email,
  role: admin.role,
  isActive: admin.isActive,
  createdAt: admin.createdAt,
  updatedAt: admin.updatedAt,
});

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  isActive: user.isActive,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const sanitizeDeliveryBoy = (deliveryBoy) => ({
  _id: deliveryBoy._id,
  name: deliveryBoy.name,
  email: deliveryBoy.email,
  phone: deliveryBoy.phone,
  isActive: deliveryBoy.isActive,
  isAvailable: deliveryBoy.isAvailable,
  lastLoginAt: deliveryBoy.lastLoginAt,
  createdAt: deliveryBoy.createdAt,
  updatedAt: deliveryBoy.updatedAt,
});

export const loginUnified = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError('Email and password are required.', 400));
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    // 1) ADMIN
    const admin = await Admin.findOne({ email: normalizedEmail }).select('+password');
    if (admin) {
      if (admin.isActive === false) {
        return next(new AppError('Admin account is inactive.', 403));
      }

      const isMatch = await comparePasswordFlexible(password, admin.password);

      if (!isMatch) {
        return next(new AppError('Invalid email or password.', 401));
      }

      const token = signToken({
        id: admin._id,
        type: 'admin',
        email: admin.email,
      });

      res.cookie('adminToken', token, getCookieOptions());

      return res.status(200).json({
        success: true,
        message: 'Login successful.',
        token,
        role: 'admin',
        redirectTo: '/admin/dashboard',
        data: {
          admin: sanitizeAdmin(admin),
        },
      });
    }

    // 2) DELIVERY
    const deliveryBoy = await DeliveryBoy.findOne({ email: normalizedEmail }).select('+password');
    if (deliveryBoy) {
      if (deliveryBoy.isActive === false) {
        return next(new AppError('Delivery account is inactive.', 403));
      }

      const isMatch = await comparePasswordFlexible(password, deliveryBoy.password);

      if (!isMatch) {
        return next(new AppError('Invalid email or password.', 401));
      }

      deliveryBoy.lastLoginAt = new Date();
      await deliveryBoy.save({ validateBeforeSave: false });

      const token = signToken({
        id: deliveryBoy._id,
        type: 'delivery',
        email: deliveryBoy.email,
      });

      res.cookie('deliveryToken', token, getCookieOptions());

      return res.status(200).json({
        success: true,
        message: 'Login successful.',
        token,
        role: 'delivery',
        redirectTo: '/delivery/dashboard',
        data: {
          deliveryBoy: sanitizeDeliveryBoy(deliveryBoy),
        },
      });
    }

    // 3) USER
    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    if (user) {
      if (user.isActive === false) {
        return next(new AppError('User account is inactive.', 403));
      }

      const isMatch = await comparePasswordFlexible(password, user.password);

      if (!isMatch) {
        return next(new AppError('Invalid email or password.', 401));
      }

      const token = signToken({
        id: user._id,
        type: 'user',
        email: user.email,
      });

      res.cookie('userToken', token, getCookieOptions());

      return res.status(200).json({
        success: true,
        message: 'Login successful.',
        token,
        role: 'user',
        redirectTo: '/orders',
        data: {
          user: sanitizeUser(user),
        },
      });
    }

    return next(new AppError('Invalid email or password.', 401));
  } catch (error) {
    next(error);
  }
};