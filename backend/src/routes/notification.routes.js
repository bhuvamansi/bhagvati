import express from 'express';
import {
  getAdminNotifications,
  getDeliveryNotifications,
  getUserNotifications,
  markNotificationRead,
} from '../controllers/notification.controller.js';
import { protectAdmin, protectDelivery, protectUser } from '../middleware/auth.js';

const router = express.Router();

router.get('/user', protectUser, getUserNotifications);
router.get('/admin', protectAdmin, getAdminNotifications);
router.get('/delivery', protectDelivery, getDeliveryNotifications);

router.patch('/user/:id/read', protectUser, markNotificationRead);
router.patch('/admin/:id/read', protectAdmin, markNotificationRead);
router.patch('/delivery/:id/read', protectDelivery, markNotificationRead);

export default router;