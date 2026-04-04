import Product from '../models/Product.js';
import Project from '../models/Project.js';
import Archive from '../models/Archive.js';
import Contact from '../models/Contact.js';
import User from '../models/User.js';
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
          activeSubscribers,
          totalAdmins,
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
    const { page = 1, limit = 20, search } = req.query;
    const currentPage = Math.max(Number(page) || 1, 1);
    const pageSize = Math.min(Math.max(Number(limit) || 20, 1), 100);
    const skip = (currentPage - 1) * pageSize;

    const query = {};
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
      ];
    }

    const [total, users] = await Promise.all([
      User.countDocuments(query),
      User.find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean(),
    ]);

    res.status(200).json({
      success: true,
      total,
      totalPages: Math.ceil(total / pageSize),
      currentPage,
      data: { users },
    });
  } catch (error) {
    next(error);
  }
};

export const updateAdminUser = async (req, res, next) => {
  try {
    const { isActive } = req.body;
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return next(new AppError('User not found.', 404));
    }

    if (typeof isActive === 'boolean') {
      user.isActive = isActive;
    }

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: 'User updated successfully.',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};
