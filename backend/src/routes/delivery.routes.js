import express from 'express';
import {
  getAllDeliveryBoys,
  getMeDeliveryBoy,
  loginDeliveryBoy,
  logoutDeliveryBoy,
} from '../controllers/delivery.controller.js';
import { protectAdmin, protectDelivery } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', loginDeliveryBoy);
router.post('/logout', protectDelivery, logoutDeliveryBoy);
router.get('/me', protectDelivery, getMeDeliveryBoy);

// admin can fetch delivery partners for assignment
router.get('/', protectAdmin, getAllDeliveryBoys);

export default router;