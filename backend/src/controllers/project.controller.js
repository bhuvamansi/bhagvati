import Project from '../models/Project.js';
import { AppError } from '../middleware/errorHandler.js';

const isAdminRequest = (req) => Boolean(req.admin);

const parseBoolean = (value) => {
  if (value === undefined) return undefined;
  if (value === true || value === 'true') return true;
  if (value === false || value === 'false') return false;
  return undefined;
};

const parseSort = (sort) => {
  const allowedSorts = {
    newest: '-createdAt',
    oldest: 'createdAt',
    featured: '-featured sortOrder -publishedAt',
    titleAsc: 'title',
    titleDesc: '-title',
  };

  return allowedSorts[sort] || '-featured sortOrder -publishedAt -createdAt';
};

const pickAllowedProjectFields = (body) => {
  const allowedFields = [
    'title',
    'slug',
    'subtitle',
    'description',
    'shortDescription',
    'category',
    'location',
    'year',
    'client',
    'coverImage',
    'gallery',
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

export const getProjects = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 9,
      category,
      featured,
      status,
      search,
      sort,
    } = req.query;

    const query = {};

    if (!isAdminRequest(req)) {
      query.status = 'published';
    } else if (status) {
      query.status = status;
    }

    if (category) query.category = category;

    const featuredValue = parseBoolean(featured);
    if (featuredValue !== undefined) query.featured = featuredValue;

    if (search) query.$text = { $search: search };

    const currentPage = Math.max(Number(page) || 1, 1);
    const pageSize = Math.min(Math.max(Number(limit) || 9, 1), 100);
    const skip = (currentPage - 1) * pageSize;

    const [total, projects] = await Promise.all([
      Project.countDocuments(query),
      Project.find(query)
        .sort(parseSort(sort))
        .skip(skip)
        .limit(pageSize)
        .lean(),
    ]);

    res.status(200).json({
      success: true,
      count: projects.length,
      total,
      totalPages: Math.ceil(total / pageSize),
      currentPage,
      data: { projects },
    });
  } catch (error) {
    next(error);
  }
};

export const getProject = async (req, res, next) => {
  try {
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(req.params.id);
    const filter = isObjectId ? { _id: req.params.id } : { slug: req.params.id };

    if (!isAdminRequest(req)) {
      filter.status = 'published';
    }

    const project = await Project.findOne(filter).lean();

    if (!project) {
      return next(new AppError('Project not found.', 404));
    }

    res.status(200).json({
      success: true,
      data: { project },
    });
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req, res, next) => {
  try {
    const payload = pickAllowedProjectFields(req.body);
    const project = await Project.create(payload);

    res.status(201).json({
      success: true,
      data: { project },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const existingProject = await Project.findById(req.params.id);

    if (!existingProject) {
      return next(new AppError('Project not found.', 404));
    }

    const payload = pickAllowedProjectFields(req.body);
    Object.assign(existingProject, payload);
    await existingProject.save();

    res.status(200).json({
      success: true,
      data: { project: existingProject },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return next(new AppError('Project not found.', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Project removed successfully.',
    });
  } catch (error) {
    next(error);
  }
};