import mongoose from 'mongoose';
import slugify from 'slugify';

const archiveImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, trim: true },
    alt: { type: String, trim: true, default: '' },
  },
  { _id: false }
);

const archiveSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, 'Archive title is required'],
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    type: {
      type: String,
      required: [true, 'Archive type is required'],
      enum: ['press', 'exhibition', 'collaboration', 'event', 'news'],
      default: 'press',
    },
    excerpt: {
      type: String,
      trim: true,
      default: '',
      maxlength: [250, 'Excerpt cannot exceed 250 characters'],
    },
    content: {
      type: String,
      trim: true,
      required: [true, 'Content is required'],
    },
    coverImage: {
      type: String,
      trim: true,
      default: '',
    },
    images: {
      type: [archiveImageSchema],
      default: [],
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'published',
      index: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
    seo: {
      metaTitle: { type: String, trim: true, default: '' },
      metaDescription: { type: String, trim: true, default: '' },
    },
  },
  { timestamps: true }
);

archiveSchema.pre('validate', function () {
  if (this.isModified('title') || !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }

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

  if (!this.coverImage && this.images.length > 0) {
    this.coverImage = this.images[0].url;
  }

  if (this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
});

archiveSchema.index({ title: 'text', excerpt: 'text', content: 'text' });
archiveSchema.index({ type: 1, status: 1, featured: 1, publishedAt: -1 });

const Archive = mongoose.model('Archive', archiveSchema);

export default Archive;