import mongoose from 'mongoose';
import slugify from 'slugify';

const projectImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, trim: true },
    alt: { type: String, trim: true, default: '' },
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    summary: {
      type: String,
      trim: true,
      maxlength: [220, 'Summary cannot exceed 220 characters'],
      default: '',
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    coverImage: {
      type: String,
      required: [true, 'Cover image is required'],
      trim: true,
    },
    images: {
      type: [projectImageSchema],
      default: [],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['residential', 'hospitality', 'commercial', 'bespoke', 'retail'],
        message: '{VALUE} is not a valid category',
      },
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'published',
      index: true,
    },
    location: {
      type: String,
      trim: true,
      default: '',
    },
    year: {
      type: Number,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

projectSchema.pre('validate', function () {
  if (Array.isArray(this.images)) {
    this.images = this.images
      .filter(Boolean)
      .map((item) => {
        if (typeof item === 'string') {
          return { url: item, alt: '' };
        }
        return { url: item.url, alt: item.alt || '' };
      })
      .filter((item) => item.url);
  }

  if (this.isModified('title') || !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }

  if (this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
});

projectSchema.index({
  title: 'text',
  summary: 'text',
  description: 'text',
  location: 'text',
});

projectSchema.index({ status: 1, featured: 1, category: 1, sortOrder: 1 });

const Project = mongoose.model('Project', projectSchema);

export default Project;