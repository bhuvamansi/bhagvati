import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    qty: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false }
);

const shippingAddressSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    apartment: { type: String, default: '', trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    pincode: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true, default: 'India' },
  },
  { _id: false }
);

const statusTimelineSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: [
        'placed',
        'under_process',
        'assigned',
        'accepted',
        'packed',
        'shipped',
        'delivered',
        'cancelled',
      ],
      required: true,
    },
    note: {
      type: String,
      default: '',
      trim: true,
    },
    changedAt: {
      type: Date,
      default: Date.now,
    },
    changedBy: {
      type: String,
      enum: ['system', 'user', 'admin', 'delivery'],
      default: 'system',
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: [
        (val) => Array.isArray(val) && val.length > 0,
        'Order must contain at least one item',
      ],
    },
    shippingAddress: {
      type: shippingAddressSchema,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ['card', 'upi', 'netbanking', 'wallet', 'cod', 'emi', 'banktransfer'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'cod'],
      default: 'pending',
    },
    paymentDetails: {
      cardName: { type: String, default: '' },
      upiId: { type: String, default: '' },
      bankName: { type: String, default: '' },
      walletName: { type: String, default: '' },
      emiPlan: { type: String, default: '' },
      transferReference: { type: String, default: '' },
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    shippingFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    promoCode: {
      type: String,
      default: '',
      trim: true,
    },
    orderStatus: {
      type: String,
      enum: ['placed', 'under_process', 'packed', 'shipped', 'delivered', 'cancelled'],
      default: 'placed',
      index: true,
    },
    statusTimeline: {
      type: [statusTimelineSchema],
      default: [],
    },
    deliveredAt: {
      type: Date,
      default: null,
    },

    // NEW DELIVERY FIELDS
    assignedDeliveryBoy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DeliveryBoy',
      default: null,
    },
    deliveryStatus: {
      type: String,
      enum: ['unassigned', 'assigned', 'accepted', 'out_for_delivery', 'completed'],
      default: 'unassigned',
      index: true,
    },
    deliveryAssignedAt: {
      type: Date,
      default: null,
    },
    deliveryAcceptedAt: {
      type: Date,
      default: null,
    },
    deliveryCompletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;