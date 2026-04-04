import express from 'express';
import {
  getArchives,
  getArchive,
  createArchive,
  updateArchive,
  deleteArchive,
} from '../controllers/archive.controller.js';
import { protectAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getArchives);
router.get('/:id', getArchive);

router.post('/', protectAdmin, createArchive);
router.patch('/:id', protectAdmin, updateArchive);
router.delete('/:id', protectAdmin, deleteArchive);

export default router;