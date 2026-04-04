import FAQ from '../models/FAQ.js';
import { AppError } from '../middleware/errorHandler.js';

export const getFAQs = async (req, res, next) => {
  try {
    const { category, published } = req.query;

    const query = {};

    if (!req.admin) {
      query.published = true;
    } else if (published !== undefined) {
      query.published = published === 'true';
    }

    if (category) {
      query.category = category;
    }

    const faqs = await FAQ.find(query).sort({ category: 1, sortOrder: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: faqs.length,
      data: { faqs },
    });
  } catch (error) {
    next(error);
  }
};

export const getFAQ = async (req, res, next) => {
  try {
    const faq = await FAQ.findById(req.params.id);

    if (!faq) {
      return next(new AppError('FAQ not found.', 404));
    }

    if (!req.admin && !faq.published) {
      return next(new AppError('FAQ not found.', 404));
    }

    res.status(200).json({
      success: true,
      data: { faq },
    });
  } catch (error) {
    next(error);
  }
};

export const createFAQ = async (req, res, next) => {
  try {
    const faq = await FAQ.create(req.body);

    res.status(201).json({
      success: true,
      data: { faq },
    });
  } catch (error) {
    next(error);
  }
};

export const updateFAQ = async (req, res, next) => {
  try {
    const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!faq) {
      return next(new AppError('FAQ not found.', 404));
    }

    res.status(200).json({
      success: true,
      data: { faq },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteFAQ = async (req, res, next) => {
  try {
    const faq = await FAQ.findByIdAndDelete(req.params.id);

    if (!faq) {
      return next(new AppError('FAQ not found.', 404));
    }

    res.status(200).json({
      success: true,
      message: 'FAQ deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};