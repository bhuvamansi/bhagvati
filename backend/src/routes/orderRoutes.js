import express from 'express';
import {
  createOrder,
  getAllOrders,
  getMyOrderById,
  getMyOrders,
  getOrderByIdAdmin,
  updateOrderStatus,
} from '../controllers/order.controller.js';
import { protectAdmin, protectUser } from '../middleware/auth.js';

const router = express.Router();

// user
router.post('/', protectUser, createOrder);
router.get('/my-orders', protectUser, getMyOrders);
router.get('/my-orders/:id', protectUser, getMyOrderById);

// admin
router.get('/', protectAdmin, getAllOrders);
router.get('/:id', protectAdmin, getOrderByIdAdmin);
router.patch('/:id/status', protectAdmin, updateOrderStatus);

export default router;