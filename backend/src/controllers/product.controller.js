import Product from '../models/Product.js';
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
    priceAsc: 'price',
    priceDesc: '-price',
    nameAsc: 'name',
    nameDesc: '-name',
  };

  return allowedSorts[sort] || '-featured sortOrder -publishedAt -createdAt';
};

const pickAllowedFields = (body) => {
  const allowedFields = [
    'name',
    'subtitle',
    'slug',
    'description',
    'shortDescription',
    'price',
    'priceLabel',
    'category',
    'roomCategory',
    'material',
    'designer',
    'dimensions',
    'specifications',
    'coverImage',
    'gallery',
    'featured',
    'inStock',
    'status',
    'sortOrder',
    'publishedAt',
    'relatedProducts',
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

export const getProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      roomCategory,
      material,
      designer,
      featured,
      inStock,
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
    if (roomCategory) query.roomCategory = roomCategory;
    if (material) query.material = material;
    if (designer) query.designer = new RegExp(designer, 'i');

    const featuredValue = parseBoolean(featured);
    if (featuredValue !== undefined) query.featured = featuredValue;

    const stockValue = parseBoolean(inStock);
    if (stockValue !== undefined) query.inStock = stockValue;

    if (search) query.$text = { $search: search };

    const currentPage = Math.max(Number(page) || 1, 1);
    const pageSize = Math.min(Math.max(Number(limit) || 12, 1), 100);
    const skip = (currentPage - 1) * pageSize;

    const [total, products] = await Promise.all([
      Product.countDocuments(query),
      Product.find(query)
        .populate('relatedProducts', 'name slug coverImage category price priceLabel')
        .sort(parseSort(sort))
        .skip(skip)
        .limit(pageSize)
        .lean(),
    ]);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      totalPages: Math.ceil(total / pageSize),
      currentPage,
      data: { products },
    });
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(req.params.id);
    const filter = isObjectId ? { _id: req.params.id } : { slug: req.params.id };

    if (!isAdminRequest(req)) {
      filter.status = 'published';
    }

    const product = await Product.findOne(filter)
      .populate('relatedProducts', 'name slug coverImage category price priceLabel')
      .lean();

    if (!product) {
      return next(new AppError('Product not found.', 404));
    }

    res.status(200).json({ success: true, data: { product } });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const payload = pickAllowedFields(req.body);
    const product = await Product.create(payload);

    res.status(201).json({ success: true, data: { product } });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const existingProduct = await Product.findById(req.params.id);

    if (!existingProduct) {
      return next(new AppError('Product not found.', 404));
    }

    const payload = pickAllowedFields(req.body);
    Object.assign(existingProduct, payload);
    await existingProduct.save();

    const product = await Product.findById(existingProduct._id).populate(
      'relatedProducts',
      'name slug coverImage category price priceLabel'
    );

    res.status(200).json({ success: true, data: { product } });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return next(new AppError('Product not found.', 404));
    }

    res.status(200).json({ success: true, message: 'Product removed successfully.' });
  } catch (error) {
    next(error);
  }
};