import express from 'express';
import {
  getFAQs,
  getFAQ,
  createFAQ,
  updateFAQ,
  deleteFAQ,
} from '../controllers/faq.controller.js';
import { protectAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getFAQs);
router.get('/:id', getFAQ);

router.post('/', protectAdmin, createFAQ);
router.put('/:id', protectAdmin, updateFAQ);
router.delete('/:id', protectAdmin, deleteFAQ);

export default router;