import express from 'express';
import {
  getSiteSettings,
  upsertSiteSettings,
} from '../controllers/siteSettings.controller.js';
import { protectAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getSiteSettings);
router.patch('/', protectAdmin, upsertSiteSettings);

export default router;