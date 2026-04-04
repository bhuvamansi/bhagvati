import Archive from '../models/Archive.js';
import { AppError } from '../middleware/errorHandler.js';

const isAdminRequest = (req) => Boolean(req.admin);

const parseBoolean = (value) => {
  if (value === undefined) return undefined;
  if (value === true || value === 'true') return true;
  if (value === false || value === 'false') return false;
  return undefined;
};

const pickAllowedArchiveFields = (body) => {
  const allowedFields = [
    'title',
    'slug',
    'description',
    'excerpt',
    'type',
    'coverImage',
    'gallery',
    'fileUrl',
    'externalUrl',
    'tags',
    'featured',
    'status',
    'sortOrder',
    'publishedAt',
    'seoTitle',
    'seoDescription',
  ];

  const filtered = {};
  for (const key of allowedFields) {
    if (body[key] !== undefined) {
      filtered[key] = body[key];
    }
  }
  return filtered;
};

export const getArchives = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      type,
      featured,
      status,
      search,
    } = req.query;

    const query = {};

    if (!isAdminRequest(req)) {
      query.status = 'published';
    } else if (status) {
      query.status = status;
    }

    if (type) query.type = type;

    const featuredValue = parseBoolean(featured);
    if (featuredValue !== undefined) query.featured = featuredValue;

    if (search) query.$text = { $search: search };

    const currentPage = Math.max(Number(page) || 1, 1);
    const pageSize = Math.min(Math.max(Number(limit) || 10, 1), 100);
    const skip = (currentPage - 1) * pageSize;

    const [total, archives] = await Promise.all([
      Archive.countDocuments(query),
      Archive.find(query)
        .sort({ featured: -1, sortOrder: 1, publishedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean(),
    ]);

    res.status(200).json({
      success: true,
      count: archives.length,
      total,
      totalPages: Math.ceil(total / pageSize),
      currentPage,
      data: { archives },
    });
  } catch (error) {
    next(error);
  }
};

export const getArchive = async (req, res, next) => {
  try {
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(req.params.id);
    const filter = isObjectId ? { _id: req.params.id } : { slug: req.params.id };

    if (!isAdminRequest(req)) {
      filter.status = 'published';
    }

    const archive = await Archive.findOne(filter).lean();

    if (!archive) {
      return next(new AppError('Archive item not found.', 404));
    }

    res.status(200).json({
      success: true,
      data: { archive },
    });
  } catch (error) {
    next(error);
  }
};

export const createArchive = async (req, res, next) => {
  try {
    const payload = pickAllowedArchiveFields(req.body);
    const archive = await Archive.create(payload);

    res.status(201).json({
      success: true,
      data: { archive },
    });
  } catch (error) {
    next(error);
  }
};

export const updateArchive = async (req, res, next) => {
  try {
    const existingArchive = await Archive.findById(req.params.id);

    if (!existingArchive) {
      return next(new AppError('Archive item not found.', 404));
    }

    const payload = pickAllowedArchiveFields(req.body);
    Object.assign(existingArchive, payload);
    await existingArchive.save();

    res.status(200).json({
      success: true,
      data: { archive: existingArchive },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteArchive = async (req, res, next) => {
  try {
    const archive = await Archive.findByIdAndDelete(req.params.id);

    if (!archive) {
      return next(new AppError('Archive item not found.', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Archive item deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};