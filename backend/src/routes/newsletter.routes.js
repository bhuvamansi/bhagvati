import express from 'express';
import {
  subscribeNewsletter,
  getSubscribers,
  unsubscribeNewsletter,
} from '../controllers/newsletter.controller.js';
import { protectAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/subscribe', subscribeNewsletter);
router.post('/unsubscribe', unsubscribeNewsletter);
router.get('/', protectAdmin, getSubscribers);

export default router;