import cloudinary from '../config/cloudinary.js';
import { AppError } from '../middleware/errorHandler.js';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
const CLOUDINARY_FOLDER = process.env.CLOUDINARY_FOLDER || 'maison-eleve';

const validateImageFiles = (files) => {
  if (!files || files.length === 0) {
    throw new AppError('No image files provided.', 400);
  }

  for (const file of files) {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new AppError(
        `Invalid file type "${file.mimetype}". Only JPG, JPEG, PNG, and WEBP are allowed.`,
        400
      );
    }

    if (!file.buffer) {
      throw new AppError('Invalid file upload buffer.', 400);
    }
  }
};

const uploadSingleToCloudinary = (file) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: CLOUDINARY_FOLDER,
        resource_type: 'image',
        transformation: [
          { quality: 'auto:best', fetch_format: 'auto' },
          { width: 2000, crop: 'limit' },
        ],
      },
      (error, result) => {
        if (error || !result) {
          return reject(new AppError('Cloudinary upload failed.', 500));
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes,
          originalName: file.originalname,
        });
      }
    );

    stream.end(file.buffer);
  });

export const uploadImages = async (req, res, next) => {
  try {
    validateImageFiles(req.files);

    const uploadedImages = await Promise.all(req.files.map(uploadSingleToCloudinary));

    res.status(200).json({
      success: true,
      message: 'Images uploaded successfully.',
      count: uploadedImages.length,
      data: {
        images: uploadedImages,
        urls: uploadedImages.map((image) => image.url),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const uploadSingleImage = async (req, res, next) => {
  try {
    const files = req.file ? [req.file] : [];
    validateImageFiles(files);

    const image = await uploadSingleToCloudinary(req.file);

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully.',
      data: { image },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteImage = async (req, res, next) => {
  try {
    const { publicId } = req.body;

    if (!publicId || typeof publicId !== 'string') {
      return next(new AppError('Image public ID is required.', 400));
    }

    const trimmedPublicId = publicId.trim();

    if (!trimmedPublicId) {
      return next(new AppError('Image public ID is required.', 400));
    }

    const result = await cloudinary.uploader.destroy(trimmedPublicId, {
      resource_type: 'image',
    });

    if (!result || result.result !== 'ok') {
      return next(new AppError('Image not found or could not be deleted.', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Image deleted from Cloudinary successfully.',
    });
  } catch (error) {
    next(error);
  }
};