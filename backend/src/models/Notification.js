import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    recipientType: {
      type: String,
      enum: ['user', 'admin', 'delivery'],
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    deliveryBoy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DeliveryBoy',
      default: null,
      index: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      default: null,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['order', 'status', 'assignment', 'delivery', 'payment', 'general'],
      default: 'general',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    meta: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;