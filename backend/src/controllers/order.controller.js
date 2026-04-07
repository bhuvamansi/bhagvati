import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { AppError } from '../middleware/errorHandler.js';

const allowedStatusTransitions = {
  placed: ['under_process', 'cancelled'],
  under_process: ['packed', 'cancelled'],
  packed: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
};

const buildTimelineNote = (status) => {
  switch (status) {
    case 'placed':
      return 'Order placed successfully.';
    case 'under_process':
      return 'Order is now under process.';
    case 'packed':
      return 'Order has been packed.';
    case 'shipped':
      return 'Order has been shipped.';
    case 'delivered':
      return 'Order has been delivered.';
    case 'cancelled':
      return 'Order has been cancelled.';
    default:
      return '';
  }
};

const normalizeOrderItems = async (items = []) => {
  const productIds = items
    .map((item) => item.product || item._id)
    .filter(Boolean);

  const products = await Product.find({ _id: { $in: productIds } }).select(
    '_id name price images'
  );

  const productMap = new Map(products.map((product) => [String(product._id), product]));

  return items.map((item) => {
    const productId = String(item.product || item._id);
    const product = productMap.get(productId);

    if (!product) {
      throw new AppError(`Product not found for item ${item.name || productId}.`, 404);
    }

    return {
      product: product._id,
      name: item.name?.trim() || product.name,
      image: item.image || item.img || product.images?.[0] || '',
      price: Number(item.price) > 0 ? Number(item.price) : Number(product.price) || 0,
      qty: Math.max(1, Number(item.qty) || 1),
    };
  });
};

export const createOrder = async (req, res, next) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      paymentDetails,
      subtotal,
      shippingFee,
      discount,
      totalAmount,
      promoCode,
    } = req.body;

    if (!req.user?._id) {
      return next(new AppError('Please log in to place an order.', 401));
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return next(new AppError('Cart items are required.', 400));
    }

    if (!shippingAddress) {
      return next(new AppError('Shipping address is required.', 400));
    }

    const requiredAddressFields = [
      'firstName',
      'lastName',
      'email',
      'phone',
      'address',
      'city',
      'state',
      'pincode',
      'country',
    ];

    for (const field of requiredAddressFields) {
      if (!shippingAddress[field]?.toString().trim()) {
        return next(new AppError(`${field} is required.`, 400));
      }
    }

    if (!paymentMethod) {
      return next(new AppError('Payment method is required.', 400));
    }

    const normalizedItems = await normalizeOrderItems(items);

    const computedSubtotal = normalizedItems.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.qty),
      0
    );

    const finalShippingFee = Math.max(0, Number(shippingFee) || 0);
    const finalDiscount = Math.max(0, Number(discount) || 0);
    const computedTotal = computedSubtotal + finalShippingFee - finalDiscount;

    const paymentStatus = paymentMethod === 'cod' ? 'cod' : 'pending';

    const order = await Order.create({
      user: req.user._id,
      items: normalizedItems,
      shippingAddress: {
        ...shippingAddress,
        email: String(shippingAddress.email).toLowerCase().trim(),
      },
      paymentMethod,
      paymentStatus,
      paymentDetails: paymentDetails || {},
      subtotal: Number(subtotal) > 0 ? Number(subtotal) : computedSubtotal,
      shippingFee: finalShippingFee,
      discount: finalDiscount,
      totalAmount: Number(totalAmount) > 0 ? Number(totalAmount) : computedTotal,
      promoCode: promoCode || '',
      orderStatus: 'placed',
      statusTimeline: [
        {
          status: 'placed',
          note: buildTimelineNote('placed'),
          changedAt: new Date(),
        },
      ],
      deliveredAt: null,
    });

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully.',
      order,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    if (!req.user?._id) {
      return next(new AppError('Unauthorized.', 401));
    }

    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyOrderById = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!order) {
      return next(new AppError('Order not found.', 404));
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderByIdAdmin = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email phone');

    if (!order) {
      return next(new AppError('Order not found.', 404));
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, paymentStatus, note = '' } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new AppError('Order not found.', 404));
    }

    if (orderStatus && orderStatus !== order.orderStatus) {
      const allowedNextStatuses = allowedStatusTransitions[order.orderStatus] || [];

      if (!allowedNextStatuses.includes(orderStatus)) {
        return next(
          new AppError(
            `Invalid status change from ${order.orderStatus} to ${orderStatus}.`,
            400
          )
        );
      }

      order.orderStatus = orderStatus;
      order.statusTimeline.push({
        status: orderStatus,
        note: note.trim() || buildTimelineNote(orderStatus),
        changedAt: new Date(),
      });

      order.deliveredAt = orderStatus === 'delivered' ? new Date() : null;
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    await order.save();

    return res.status(200).json({
      success: true,
      message: 'Order updated successfully.',
      order,
    });
  } catch (error) {
    next(error);
  }
};