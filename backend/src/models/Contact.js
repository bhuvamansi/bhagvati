import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Name is required'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      trim: true,
      required: [true, 'Email is required'],
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    subject: {
      type: String,
      trim: true,
      default: '',
      maxlength: [150, 'Subject cannot exceed 150 characters'],
    },
    message: {
      type: String,
      trim: true,
      required: [true, 'Message is required'],
      maxlength: [3000, 'Message cannot exceed 3000 characters'],
    },
    type: {
      type: String,
      enum: ['general', 'bespoke', 'project', 'support'],
      default: 'general',
    },
    status: {
      type: String,
      enum: ['new', 'read', 'replied', 'closed'],
      default: 'new',
    },
  },
  { timestamps: true }
);

contactSchema.index({ email: 1, status: 1, createdAt: -1 });

const Contact = mongoose.model('Contact', contactSchema);
export default Contact;