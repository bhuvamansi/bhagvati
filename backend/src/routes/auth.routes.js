import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  registerAdmin,
  login,
  logout,
  getMe,
  registerUser,
  loginUser,
  logoutUser,
  getMeUser,
  forgotPasswordUser,
  resetPasswordUser,
  changePasswordUser,
} from '../controllers/auth.controller.js';
import { protectAdmin, protectUser, authorize } from '../middleware/auth.js';

const router = express.Router();

const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many admin login attempts. Please try again in 15 minutes.',
  },
});

const userLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login attempts. Please try again in 15 minutes.',
  },
});

const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many password reset requests. Please try again later.',
  },
});

// Admin
router.post('/register', registerAdmin);
router.post('/login', adminLoginLimiter, login);
router.post('/logout', logout);
router.get('/me', protectAdmin, getMe);
router.post('/register-admin', protectAdmin, authorize('superadmin'), registerAdmin);

// User
router.post('/user/register', registerUser);
router.post('/user/login', userLoginLimiter, loginUser);
router.post('/user/logout', logoutUser);
router.get('/user/me', protectUser, getMeUser);
router.patch('/user/change-password', protectUser, changePasswordUser);

// Forgot / Reset Password
router.post('/user/forgot-password', forgotPasswordLimiter, forgotPasswordUser);
router.patch('/user/reset-password/:token', resetPasswordUser);

export default router;