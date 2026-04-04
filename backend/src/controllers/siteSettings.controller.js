import SiteSettings from '../models/SiteSettings.js';
import { AppError } from '../middleware/errorHandler.js';

const pickAllowedSiteSettingsFields = (body) => {
  const allowedFields = [
    'siteName',
    'siteTagline',
    'siteDescription',
    'logo',
    'favicon',
    'contactEmail',
    'contactPhone',
    'contactAddress',
    'socialLinks',
    'footerText',
    'copyrightText',
    'seoTitle',
    'seoDescription',
    'homepageSeoTitle',
    'homepageSeoDescription',
    'maintenanceMode',
  ];

  const filtered = {};
  for (const key of allowedFields) {
    if (body[key] !== undefined) {
      filtered[key] = body[key];
    }
  }
  return filtered;
};

export const getSiteSettings = async (req, res, next) => {
  try {
    let settings = await SiteSettings.findOne().lean();

    if (!settings) {
      const createdSettings = await SiteSettings.create({});
      settings = createdSettings.toObject();
    }

    res.status(200).json({
      success: true,
      data: { settings },
    });
  } catch (error) {
    next(error);
  }
};

export const upsertSiteSettings = async (req, res, next) => {
  try {
    const payload = pickAllowedSiteSettingsFields(req.body);

    if (Object.keys(payload).length === 0) {
      return next(new AppError('No valid settings fields provided.', 400));
    }

    let settings = await SiteSettings.findOne();

    if (!settings) {
      settings = await SiteSettings.create(payload);
    } else {
      Object.assign(settings, payload);
      await settings.save();
    }

    res.status(200).json({
      success: true,
      data: { settings },
    });
  } catch (error) {
    next(error);
  }
};