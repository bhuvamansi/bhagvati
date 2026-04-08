import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const deliveryBoySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Delivery person name is required.'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required.'],
      minlength: 8,
      select: false,
    },
    phone: {
      type: String,
      required: [true, 'Phone is required.'],
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

deliveryBoySchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

deliveryBoySchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const DeliveryBoy = mongoose.model('DeliveryBoy', deliveryBoySchema);

export default DeliveryBoy