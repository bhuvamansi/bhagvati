import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema(
  {
    brandName: {
      type: String,
      trim: true,
      default: 'Furniture Studio',
    },
    brandTagline: {
      type: String,
      trim: true,
      default: '',
    },
    logo: {
      type: String,
      trim: true,
      default: '',
    },
    contactEmail: {
      type: String,
      trim: true,
      default: '',
    },
    contactPhone: {
      type: String,
      trim: true,
      default: '',
    },
    whatsapp: {
      type: String,
      trim: true,
      default: '',
    },
    address: {
      type: String,
      trim: true,
      default: '',
    },
    mapLink: {
      type: String,
      trim: true,
      default: '',
    },
    showroomHours: {
      type: String,
      trim: true,
      default: '',
    },
    socialLinks: {
      instagram: { type: String, trim: true, default: '' },
      facebook: { type: String, trim: true, default: '' },
      pinterest: { type: String, trim: true, default: '' },
      linkedin: { type: String, trim: true, default: '' },
      youtube: { type: String, trim: true, default: '' },
    },
    seo: {
      metaTitle: { type: String, trim: true, default: '' },
      metaDescription: { type: String, trim: true, default: '' },
    },
    footerText: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { timestamps: true }
);

const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);
export default SiteSettings;