import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      trim: true,
      required: [true, 'FAQ category is required'],
      enum: [
        'general',
        'orders',
        'delivery',
        'returns',
        'customization',
        'products',
        'support'
      ],
      default: 'general'
    },

    question: {
      type: String,
      trim: true,
      required: [true, 'Question is required'],
      minlength: [5, 'Question must be at least 5 characters'],
      maxlength: [300, 'Question cannot exceed 300 characters']
    },

    answer: {
      type: String,
      trim: true,
      required: [true, 'Answer is required'],
      minlength: [5, 'Answer must be at least 5 characters']
    },

    published: {
      type: Boolean,
      default: true,
      index: true
    },

    sortOrder: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

/* ---------------- INDEXES ---------------- */
faqSchema.index({ category: 1, published: 1, sortOrder: 1 });

/* ---------------- MODEL ---------------- */
const FAQ = mongoose.model('FAQ', faqSchema);

export default FAQ;