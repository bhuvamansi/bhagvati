import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import Admin from '../models/Admin.js';
import User from '../models/User.js';
import { AppError } from '../middleware/errorHandler.js';
import sendEmail from '../utils/sendEmail.js';

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_\-+=.])[A-Za-z\d@$!%*?&^#()_\-+=.]{8,}$/;

const signToken = (payload) => {
  if (!process.env.JWT_SECRET) {
    throw new AppError('JWT_SECRET is not configured.', 500);
  }

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

const isStrongPassword = (password = '') => PASSWORD_REGEX.test(password);

const normalizeEmail = (email = '') => email.toLowerCase().trim();
const normalizeUrl = (value = '') => String(value).trim().replace(/\/+$/, '');

const getFrontendBaseUrl = (req) => {
  const configuredUrl =
    process.env.PUBLIC_APP_URL ||
    process.env.FRONTEND_URL ||
    process.env.CLIENT_URL;

  if (configuredUrl) {
    return normalizeUrl(configuredUrl);
  }

  const origin = req.get('origin');
  if (origin) {
    return normalizeUrl(origin);
  }

  const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
  const host = req.get('host');

  if (host) {
    return `${protocol}://${host}`;
  }

  return 'http://localhost:5173';
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

const sanitizeAdmin = (admin) => ({
  _id: admin._id,
  name: admin.name,
  email: admin.email,
  role: admin.role,
  isActive: admin.isActive,
  lastLoginAt: admin.lastLoginAt,
  createdAt: admin.createdAt,
  updatedAt: admin.updatedAt,
});

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  addresses: user.addresses,
  isActive: user.isActive,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const validatePasswordOrThrow = (password) => {
  if (!isStrongPassword(password)) {
    throw new AppError(
      'Password must be at least 8 characters and include uppercase, lowercase, number and special character.',
      400
    );
  }
};

const sendAdminAuthResponse = (admin, statusCode, res, message = 'Success') => {
  const token = signToken({
    id: admin._id,
    role: admin.role,
    type: 'admin',
    email: admin.email,
  });

  res.cookie('adminToken', token, getCookieOptions());

  res.status(statusCode).json({
    success: true,
    message,
    token,
    data: {
      admin: sanitizeAdmin(admin),
    },
  });
};

const sendUserAuthResponse = (user, statusCode, res, message = 'Success') => {
  const token = signToken({
    id: user._id,
    type: 'user',
    email: user.email,
  });

  res.cookie('userToken', token, getCookieOptions());

  res.status(statusCode).json({
    success: true,
    message,
    token,
    data: {
      user: sanitizeUser(user),
    },
  });
};

export const registerAdmin = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return next(new AppError('Name, email and password are required.', 400));
    }

    validatePasswordOrThrow(password);

    const normalizedEmail = normalizeEmail(email);
    const existingAdmin = await Admin.findOne({ email: normalizedEmail });

    if (existingAdmin) {
      return next(new AppError('Admin already exists with this email.', 409));
    }

    const adminCount = await Admin.countDocuments();

    if (adminCount === 0) {
      const firstAdmin = await Admin.create({
        name: name.trim(),
        email: normalizedEmail,
        password,
        role: role === 'superadmin' ? 'superadmin' : 'admin',
      });

      return sendAdminAuthResponse(
        firstAdmin,
        201,
        res,
        'First admin registered successfully.'
      );
    }

    if (!req.admin || req.admin.role !== 'superadmin') {
      return next(new AppError('Only a superadmin can create another admin.', 403));
    }

    const newAdmin = await Admin.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: role === 'superadmin' ? 'superadmin' : 'admin',
    });

    return res.status(201).json({
      success: true,
      message: 'Admin created successfully.',
      data: {
        admin: sanitizeAdmin(newAdmin),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError('Email and password are required.', 400));
    }

    const normalizedEmail = normalizeEmail(email);
    const admin = await Admin.findOne({ email: normalizedEmail }).select('+password');

    if (!admin) {
      return next(new AppError('Invalid email or password.', 401));
    }

    if (!admin.isActive) {
      return next(new AppError('Your admin account is inactive.', 403));
    }

    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      return next(new AppError('Invalid email or password.', 401));
    }

    admin.lastLoginAt = new Date();
    await admin.save({ validateBeforeSave: false });

    return sendAdminAuthResponse(admin, 200, res, 'Admin login successful.');
  } catch (error) {
    next(error);
  }
};

export const logout = (req, res) => {
  res.cookie('adminToken', '', getLogoutCookieOptions());

  res.status(200).json({
    success: true,
    message: 'Admin logged out successfully.',
  });
};

export const getMe = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin._id).select('-password');

    if (!admin) {
      return next(new AppError('Admin not found.', 404));
    }

    res.status(200).json({
      success: true,
      data: {
        admin: sanitizeAdmin(admin),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      return next(new AppError('Name, email and password are required.', 400));
    }

    validatePasswordOrThrow(password);

    const normalizedEmail = normalizeEmail(email);
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return next(new AppError('User already exists with this email.', 409));
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      phone: phone?.trim() || undefined,
      password,
    });

    return sendUserAuthResponse(user, 201, res, 'User registered successfully.');
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError('Email and password are required.', 400));
    }

    const normalizedEmail = normalizeEmail(email);
    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (!user) {
      return next(new AppError('Invalid email or password.', 401));
    }

    if (!user.isActive) {
      return next(new AppError('Your account is inactive.', 403));
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return next(new AppError('Invalid email or password.', 401));
    }

    return sendUserAuthResponse(user, 200, res, 'User login successful.');
  } catch (error) {
    next(error);
  }
};

export const logoutUser = (req, res) => {
  res.cookie('userToken', '', getLogoutCookieOptions());

  res.status(200).json({
    success: true,
    message: 'User logged out successfully.',
  });
};

export const getMeUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
      return next(new AppError('User not found.', 404));
    }

    res.status(200).json({
      success: true,
      data: {
        user: sanitizeUser(user),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const changePasswordUser = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return next(
        new AppError(
          'Current password, new password and confirm password are required.',
          400
        )
      );
    }

    if (newPassword !== confirmPassword) {
      return next(new AppError('New password and confirm password do not match.', 400));
    }

    validatePasswordOrThrow(newPassword);

    const user = await User.findById(req.user._id).select(
      '+password +resetPasswordToken +resetPasswordExpire'
    );

    if (!user) {
      return next(new AppError('User not found.', 404));
    }

    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return next(new AppError('Current password is incorrect.', 401));
    }

    user.password = newPassword;
    user.clearPasswordResetToken();

    await user.save();

    return sendUserAuthResponse(user, 200, res, 'Password changed successfully.');
  } catch (error) {
    next(error);
  }
};

export const forgotPasswordUser = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return next(new AppError('Email is required.', 400));
    }

    const normalizedEmail = normalizeEmail(email);

    const user = await User.findOne({ email: normalizedEmail }).select(
      '+resetPasswordToken +resetPasswordExpire'
    );

    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If an account exists with this email, a reset link has been sent.',
      });
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const baseUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const resetUrl = `${baseUrl.replace(/\/$/, '')}/reset-password/${resetToken}`;

    const text = [
      'You requested a password reset.',
      '',
      'Please use the link below to reset your password:',
      resetUrl,
      '',
      'This link will expire in 10 minutes.',
      '',
      'If you did not request this, please ignore this email.',
    ].join('\n');

    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
        <h2 style="margin-bottom: 12px;">Password Reset Request</h2>
        <p>You requested a password reset.</p>
        <p>
          <a href="${resetUrl}" style="display:inline-block;padding:10px 18px;background:#111827;color:#ffffff;text-decoration:none;border-radius:6px;">
            Reset Password
          </a>
        </p>
        <p style="word-break: break-all;">${resetUrl}</p>
        <p>This link will expire in 10 minutes.</p>
        <p>If you did not request this, you can safely ignore this email.</p>
      </div>
    `;

    try {
      await sendEmail({
        to: user.email,
        subject: 'Reset Your Password',
        text,
        html,
      });

      return res.status(200).json({
        success: true,
        message: 'Password reset link has been sent to your email.',
        ...(process.env.NODE_ENV !== 'production' ? { resetUrl } : {}),
      });
    } catch (emailError) {
      if (process.env.NODE_ENV !== 'production') {
        return res.status(200).json({
          success: true,
          message: 'Email sending failed on localhost, but reset link was generated.',
          resetUrl,
          emailError: emailError.message,
        });
      }

      user.clearPasswordResetToken();
      await user.save({ validateBeforeSave: false });

      return next(new AppError(emailError.message || 'Failed to send reset email.', 500));
    }
  } catch (error) {
    next(error);
  }
};
export const resetPasswordUser = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (!token) {
      return next(new AppError('Reset token is required.', 400));
    }

    if (!password || !confirmPassword) {
      return next(new AppError('Password and confirm password are required.', 400));
    }

    if (password !== confirmPassword) {
      return next(new AppError('Password and confirm password do not match.', 400));
    }

    validatePasswordOrThrow(password);

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: new Date() },
    }).select('+resetPasswordToken +resetPasswordExpire +password');

    if (!user) {
      return next(new AppError('Reset token is invalid or has expired.', 400));
    }

    user.password = password;
    user.clearPasswordResetToken();

    await user.save();

    return sendUserAuthResponse(user, 200, res, 'Password reset successful.');
  } catch (error) {
    next(error);
  }
};