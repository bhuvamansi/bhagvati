import express from 'express';
import { createOrder, getAllOrders, getMyOrders } from '../../controllers/orderController.js';

const router = express.Router();

// add your auth middleware here if you already have it
// import { protect, adminOnly } from '../middleware/authMiddleware.js';

// public / semi-protected create
router.post('/', createOrder);

// protected user orders
router.get('/my-orders', getMyOrders);

// admin
router.get('/', getAllOrders);

export default router;