import Contact from '../models/Contact.js';
import { AppError } from '../middleware/errorHandler.js';

export const submitContact = async (req, res, next) => {
  try {
    const contact = await Contact.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Your message has been submitted successfully.',
      data: { contact },
    });
  } catch (error) {
    next(error);
  }
};

export const getContacts = async (req, res, next) => {
  try {
    const { status, type, page = 1, limit = 20 } = req.query;

    const query = {};
    if (status) query.status = status;
    if (type) query.type = type;

    const currentPage = Math.max(Number(page) || 1, 1);
    const pageSize = Math.max(Number(limit) || 20, 1);
    const skip = (currentPage - 1) * pageSize;

    const [total, contacts] = await Promise.all([
      Contact.countDocuments(query),
      Contact.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize),
    ]);

    res.status(200).json({
      success: true,
      count: contacts.length,
      total,
      totalPages: Math.ceil(total / pageSize),
      currentPage,
      data: { contacts },
    });
  } catch (error) {
    next(error);
  }
};

export const getContact = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return next(new AppError('Contact inquiry not found.', 404));
    }

    res.status(200).json({
      success: true,
      data: { contact },
    });
  } catch (error) {
    next(error);
  }
};

export const updateContactStatus = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return next(new AppError('Contact inquiry not found.', 404));
    }

    res.status(200).json({
      success: true,
      data: { contact },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return next(new AppError('Contact inquiry not found.', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Contact inquiry deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};