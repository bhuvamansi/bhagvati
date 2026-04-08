import Product from '../models/Product.js';
import Project from '../models/Project.js';
import Archive from '../models/Archive.js';
import Contact from '../models/Contact.js';
import User from '../models/User.js';
import DeliveryBoy from '../models/DeliveryBoy.js';
import NewsletterSubscriber from '../models/NewsletterSubscriber.js';
import Admin from '../models/Admin.js';
import { AppError } from '../middleware/errorHandler.js';

export const getAdminAnalytics = async (req, res, next) => {
  try {
    const [
      totalProducts,
      publishedProducts,
      totalProjects,
      totalArchives,
      totalEnquiries,
      newEnquiries,
      totalUsers,
      totalDeliveryBoys,
      activeSubscribers,
      totalAdmins,
      featuredProducts,
      featuredProjects,
      recentEnquiries,
    ] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ status: 'published' }),
      Project.countDocuments(),
      Archive.countDocuments(),
      Contact.countDocuments(),
      Contact.countDocuments({ status: 'new' }),
      User.countDocuments(),
      DeliveryBoy.countDocuments(),
      NewsletterSubscriber.countDocuments({ active: true }),
      Admin.countDocuments(),
      Product.countDocuments({ featured: true, status: 'published' }),
      Project.countDocuments({ featured: true, status: 'published' }),
      Contact.find().sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalProducts,
          publishedProducts,
          totalProjects,
          totalArchives,
          totalEnquiries,
          newEnquiries,
          totalUsers,
          totalDeliveryBoys,
          totalAdmins,
          activeSubscribers,
          featuredProducts,
          featuredProjects,
        },
        recentEnquiries,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, search = '', role = 'all' } = req.query;

    const currentPage = Math.max(Number(page) || 1, 1);
    const pageSize = Math.min(Math.max(Number(limit) || 50, 1), 200);
    const normalizedSearch = String(search).trim();

    const userQuery = {};
    const deliveryQuery = {};

    if (normalizedSearch) {
      const regex = new RegExp(normalizedSearch, 'i');
      userQuery.$or = [{ name: regex }, { email: regex }, { phone: regex }];
      deliveryQuery.$or = [{ name: regex }, { email: regex }, { phone: regex }];
    }

    let users = [];
    let deliveryBoys = [];

    if (role === 'all' || role === 'user') {
      users = await User.find(userQuery)
        .select('-password -resetPasswordToken -resetPasswordExpire -passwordChangedAt')
        .sort({ createdAt: -1 })
        .lean();

      users = users.map((item) => ({
        ...item,
        role: 'user',
        roleLabel: 'User',
        isAvailable: null,
      }));
    }

    if (role === 'all' || role === 'delivery') {
      deliveryBoys = await DeliveryBoy.find(deliveryQuery)
        .select('-password')
        .sort({ createdAt: -1 })
        .lean();

      deliveryBoys = deliveryBoys.map((item) => ({
        ...item,
        role: 'delivery',
        roleLabel: 'Delivery Partner',
      }));
    }

    const combined = [...users, ...deliveryBoys].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    const total = combined.length;
    const start = (currentPage - 1) * pageSize;
    const paginated = combined.slice(start, start + pageSize);

    res.status(200).json({
      success: true,
      total,
      totalPages: Math.ceil(total / pageSize),
      currentPage,
      data: {
        users: paginated,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateAdminUser = async (req, res, next) => {
  try {
    const { isActive, isAvailable, role } = req.body;

    if (!role || !['user', 'delivery'].includes(role)) {
      return next(new AppError('Valid role is required.', 400));
    }

    if (role === 'user') {
      const user = await User.findById(req.params.id).select(
        '-password -resetPasswordToken -resetPasswordExpire -passwordChangedAt'
      );

      if (!user) {
        return next(new AppError('User not found.', 404));
      }

      if (typeof isActive === 'boolean') {
        user.isActive = isActive;
      }

      await user.save({ validateBeforeSave: false });

      return res.status(200).json({
        success: true,
        message: 'User updated successfully.',
        data: {
          user: {
            ...user.toObject(),
            role: 'user',
            roleLabel: 'User',
            isAvailable: null,
          },
        },
      });
    }

    if (role === 'delivery') {
      const deliveryBoy = await DeliveryBoy.findById(req.params.id).select('-password');

      if (!deliveryBoy) {
        return next(new AppError('Delivery partner not found.', 404));
      }

      if (typeof isActive === 'boolean') {
        deliveryBoy.isActive = isActive;
      }

      if (typeof isAvailable === 'boolean') {
        deliveryBoy.isAvailable = isAvailable;
      }

      await deliveryBoy.save({ validateBeforeSave: false });

      return res.status(200).json({
        success: true,
        message: 'Delivery partner updated successfully.',
        data: {
          user: {
            ...deliveryBoy.toObject(),
            role: 'delivery',
            roleLabel: 'Delivery Partner',
          },
        },
      });
    }
  } catch (error) {
    next(error);
  }
};