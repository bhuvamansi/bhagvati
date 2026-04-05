import mongoose from 'mongoose';
import slugify from 'slugify';

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, trim: true },
    alt: { type: String, trim: true, default: '' },
    publicId: { type: String, trim: true, default: '' },
  },
  { _id: false }
);

const materialOptionSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
    image: { type: String, trim: true, default: '' },
  },
  { _id: false }
);

const materialGroupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['wood', 'fabric', 'stone', 'metal', 'leather', 'glass', 'other'],
      default: 'other',
    },
    options: { type: [materialOptionSchema], default: [] },
  },
  { _id: false }
);

const dimensionSchema = new mongoose.Schema(
  {
    width: { type: Number },
    depth: { type: Number },
    height: { type: Number },
    diameter: { type: Number },
    seatHeight: { type: Number },
    unit: { type: String, default: 'cm', trim: true },
  },
  { _id: false }
);

const specSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const seoSchema = new mongoose.Schema(
  {
    metaTitle: { type: String, trim: true, maxlength: 70, default: '' },
    metaDescription: { type: String, trim: true, maxlength: 160, default: '' },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [120, 'Name cannot exceed 120 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    sku: {
      type: String,
      trim: true,
      uppercase: true,
      default: '',
    },
    subtitle: {
      type: String,
      trim: true,
      maxlength: [140, 'Subtitle cannot exceed 140 characters'],
      default: '',
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      maxlength: [240, 'Short description cannot exceed 240 characters'],
    },
    description: {
      type: String,
      required: [true, 'Full description is required'],
    },
    price: {
      type: Number,
      min: [0, 'Price cannot be negative'],
      default: 0,
    },
    priceLabel: {
      type: String,
      trim: true,
      default: 'Price on request',
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'published',
      index: true,
    },
    coverImage: {
      type: String,
      trim: true,
      default: '',
    },
    images: {
      type: [imageSchema],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length >= 1,
        message: 'At least one product image is required',
      },
      default: [],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: [
          'sofa',
          'table',
          'chair',
          'bed',
          'storage',
          'desk',
          'lighting',
          'accessory',
          'cabinet',
          'shelving',
        ],
        message: '{VALUE} is not a valid category',
      },
    },
    roomCategory: {
      type: String,
      enum: [
        'living',
        'dining',
        'bedroom',
        'office',
        'outdoor',
        'entry',
        'multi-space',
      ],
      default: 'living',
    },
    collection: {
      type: String,
      trim: true,
      default: '',
    },
    material: {
      type: String,
      required: [true, 'Primary material is required'],
      enum: {
        values: [
          'oak',
          'walnut',
          'ash',
          'marble',
          'fabric',
          'leather',
          'brass',
          'glass',
          'steel',
          'mixed',
        ],
        message: '{VALUE} is not a valid material',
      },
    },
    materials: {
      type: [materialGroupSchema],
      default: [],
    },
    dimensions: {
      type: dimensionSchema,
      default: () => ({}),
    },
    specifications: {
      type: [specSchema],
      default: [],
    },
    careInstructions: {
      type: String,
      trim: true,
      default: '',
    },
    designer: {
      type: String,
      trim: true,
      default: '',
    },
    customization: {
      enabled: { type: Boolean, default: false },
      text: { type: String, trim: true, default: '' },
    },
    relatedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    featured: {
      type: Boolean,
      default: false,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
    seo: {
      type: seoSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    suppressReservedKeysWarning: true,
  }
);

const normalizeImages = (images = []) => {
  if (!Array.isArray(images)) return [];

  return images
    .filter(Boolean)
    .map((item) => {
      if (typeof item === 'string') {
        return {
          url: item,
          alt: '',
          publicId: '',
        };
      }

      return {
        url: item.url,
        alt: item.alt || '',
        publicId: item.publicId || '',
      };
    })
    .filter((item) => item.url);
};

productSchema.pre('validate', function () {
  this.images = normalizeImages(this.images);

  if ((!this.images || this.images.length === 0) && this.coverImage) {
    this.images = [
      {
        url: this.coverImage,
        alt: this.name || '',
        publicId: '',
      },
    ];
  }

  if (!this.coverImage && this.images.length > 0) {
    this.coverImage = this.images[0].url;
  }

  if (this.isModified('name') || !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }

  if (this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
});

productSchema.index({
  name: 'text',
  subtitle: 'text',
  shortDescription: 'text',
  description: 'text',
  designer: 'text',
  collection: 'text',
});

productSchema.index({
  status: 1,
  category: 1,
  roomCategory: 1,
  material: 1,
  featured: 1,
  sortOrder: 1,
});

const Product = mongoose.model('Product', productSchema);

export default Product;