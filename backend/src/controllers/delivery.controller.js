import jwt from 'jsonwebtoken';
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

const getLogoutCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    expires: new Date(0),
    path: '/',
  };
};

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

export const loginDeliveryBoy = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError('Email and password are required.', 400));
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const deliveryBoy = await DeliveryBoy.findOne({ email: normalizedEmail }).select('+password');

    if (!deliveryBoy) {
      return next(new AppError('Invalid email or password.', 401));
    }

    if (!deliveryBoy.isActive) {
      return next(new AppError('Your delivery account is inactive.', 403));
    }

    const isMatch = await deliveryBoy.comparePassword(password);

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
      message: 'Delivery login successful.',
      token,
      data: {
        deliveryBoy: sanitizeDeliveryBoy(deliveryBoy),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logoutDeliveryBoy = (req, res) => {
  res.cookie('deliveryToken', '', getLogoutCookieOptions());

  res.status(200).json({
    success: true,
    message: 'Delivery logged out successfully.',
  });
};

export const getMeDeliveryBoy = async (req, res, next) => {
  try {
    const deliveryBoy = await DeliveryBoy.findById(req.deliveryBoy._id).select('-password');

    if (!deliveryBoy) {
      return next(new AppError('Delivery person not found.', 404));
    }

    return res.status(200).json({
      success: true,
      data: {
        deliveryBoy: sanitizeDeliveryBoy(deliveryBoy),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllDeliveryBoys = async (req, res, next) => {
  try {
    const deliveryBoys = await DeliveryBoy.find().select('-password').sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      deliveryBoys,
    });
  } catch (error) {
    next(error);
  }
};