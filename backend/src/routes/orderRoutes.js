import express from 'express';
import {
  cancelMyOrder,
  createOrder,
  getAllOrders,
  getMyDeliveryOrders,
  getMyOrderById,
  getMyOrders,
  getOrderByIdAdmin,
  updateOrderStatus,
  assignDeliveryBoy,
  deliveryUpdateStatus,
} from '../controllers/order.controller.js';
import { protectAdmin, protectDelivery, protectUser } from '../middleware/auth.js';

const router = express.Router();

// user
router.post('/', protectUser, createOrder);
router.get('/my-orders', protectUser, getMyOrders);
router.get('/my-orders/:id', protectUser, getMyOrderById);
router.patch('/my-orders/:id/cancel', protectUser, cancelMyOrder);

// delivery
router.get('/delivery/my-orders', protectDelivery, getMyDeliveryOrders);
router.patch('/delivery/:id/status', protectDelivery, deliveryUpdateStatus);

// admin
router.get('/', protectAdmin, getAllOrders);
router.get('/:id', protectAdmin, getOrderByIdAdmin);
router.patch('/:id/status', protectAdmin, updateOrderStatus);
router.patch('/:id/assign-delivery', protectAdmin, assignDeliveryBoy);

export default router;