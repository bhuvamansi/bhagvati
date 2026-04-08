import Notification from '../models/Notification.js';
import { AppError } from '../middleware/errorHandler.js';

export const getUserNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({
      recipientType: 'user',
      user: req.user._id,
    })
      .sort({ createdAt: -1 })
      .limit(50);

    return res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({
      recipientType: 'admin',
    })
      .sort({ createdAt: -1 })
      .limit(100);

    return res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    next(error);
  }
};

export const getDeliveryNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({
      recipientType: 'delivery',
      deliveryBoy: req.deliveryBoy._id,
    })
      .sort({ createdAt: -1 })
      .limit(50);

    return res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    next(error);
  }
};

export const markNotificationRead = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return next(new AppError('Notification not found.', 404));
    }

    notification.isRead = true;
    await notification.save();

    return res.status(200).json({
      success: true,
      message: 'Notification marked as read.',
      notification,
    });
  } catch (error) {
    next(error);
  }
};