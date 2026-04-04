import express from 'express';
import { protectAdmin } from '../middleware/auth.js';
import {
  getAdminAnalytics,
  getAdminUsers,
  updateAdminUser,
} from '../controllers/admin.controller.js';

const router = express.Router();

router.use(protectAdmin);
router.get('/analytics', getAdminAnalytics);
router.get('/users', getAdminUsers);
router.patch('/users/:id', updateAdminUser);

export default router;
