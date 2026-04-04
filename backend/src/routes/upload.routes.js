import express from 'express';
import {
  uploadImages,
  uploadSingleImage,
  deleteImage,
} from '../controllers/upload.controller.js';
import { protectAdmin } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.post('/', protectAdmin, upload.array('images', 10), uploadImages);
router.post('/single', protectAdmin, upload.single('image'), uploadSingleImage);
router.delete('/', protectAdmin, deleteImage);

export default router;