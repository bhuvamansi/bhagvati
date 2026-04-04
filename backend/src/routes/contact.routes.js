import express from 'express';
import {
  submitContact,
  getContacts,
  getContact,
  updateContactStatus,
  deleteContact,
} from '../controllers/contact.controller.js';
import { protectAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', submitContact);

router.get('/', protectAdmin, getContacts);
router.get('/:id', protectAdmin, getContact);
router.put('/:id/status', protectAdmin, updateContactStatus);
router.delete('/:id', protectAdmin, deleteContact);

export default router;