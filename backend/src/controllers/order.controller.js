import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Notification from '../models/Notification.js';
import DeliveryBoy from '../models/DeliveryBoy.js';
import { AppError } from '../middleware/errorHandler.js';

const allowedStatusTransitions = {
  placed: ['under_process', 'cancelled'],
  under_process: ['packed', 'cancelled'],
  packed: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
};

const deliveryManagedStatuses = ['packed', 'shipped', 'delivered'];
const userCancellableStatuses = ['placed', 'under_process'];

const buildTimelineNote = (status) => {
  switch (status) {
    case 'placed':
      return 'Order placed successfully.';
    case 'under_process':
      return 'Order is now under process.';
    case 'assigned':
      return 'Order has been assigned to delivery partner.';
    case 'accepted':
      return 'Delivery partner accepted the order.';
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

const createNotification = async (payload) => {
  try {
    await Notification.create(payload);
  } catch (error) {
    console.error('Notification create error:', error.message);
  }
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
          changedBy: 'user',
        },
      ],
      deliveredAt: null,
      assignedDeliveryBoy: null,
      deliveryStatus: 'unassigned',
      deliveryAssignedAt: null,
      deliveryAcceptedAt: null,
      deliveryCompletedAt: null,
    });

    await createNotification({
      recipientType: 'admin',
      order: order._id,
      title: 'New order placed',
      message: `A new order was placed by ${shippingAddress.firstName} ${shippingAddress.lastName}.`,
      type: 'order',
      meta: {
        orderId: order._id,
      },
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

    const orders = await Order.find({ user: req.user._id })
      .populate('assignedDeliveryBoy', 'name email phone')
      .sort({ createdAt: -1 });

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
    }).populate('assignedDeliveryBoy', 'name email phone');

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

export const cancelMyOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate('assignedDeliveryBoy', 'name email phone');

    if (!order) {
      return next(new AppError('Order not found.', 404));
    }

    if (!userCancellableStatuses.includes(order.orderStatus)) {
      return next(
        new AppError(
          'This order can no longer be cancelled. Only placed or under process orders can be cancelled.',
          400
        )
      );
    }

    order.orderStatus = 'cancelled';
    order.statusTimeline.push({
      status: 'cancelled',
      note: 'Order cancelled by user.',
      changedAt: new Date(),
      changedBy: 'user',
    });

    await order.save();

    await createNotification({
      recipientType: 'admin',
      order: order._id,
      title: 'Order cancelled',
      message: `Customer cancelled order ${order._id}.`,
      type: 'status',
      meta: { orderId: order._id, status: 'cancelled' },
    });

    return res.status(200).json({
      success: true,
      message: 'Order cancelled successfully.',
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
      .populate('assignedDeliveryBoy', 'name email phone isAvailable')
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
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('assignedDeliveryBoy', 'name email phone isAvailable');

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

    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('assignedDeliveryBoy', 'name email phone');

    if (!order) {
      return next(new AppError('Order not found.', 404));
    }

    if (orderStatus && orderStatus !== order.orderStatus) {
      if (deliveryManagedStatuses.includes(orderStatus)) {
        return next(
          new AppError(
            'Packed, shipped and delivered statuses must be updated by the assigned delivery partner.',
            400
          )
        );
      }

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
        changedBy: 'admin',
      });

      if (orderStatus === 'cancelled') {
        order.deliveredAt = null;
      }
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    await order.save();

    if (orderStatus) {
      await createNotification({
        recipientType: 'user',
        user: order.user?._id || order.user,
        order: order._id,
        title: 'Order status updated',
        message: `Your order is now ${orderStatus.replace(/_/g, ' ')}.`,
        type: 'status',
        meta: { orderId: order._id, status: orderStatus },
      });
    }

    if (paymentStatus) {
      await createNotification({
        recipientType: 'user',
        user: order.user?._id || order.user,
        order: order._id,
        title: 'Payment status updated',
        message: `Payment status is now ${paymentStatus}.`,
        type: 'payment',
        meta: { orderId: order._id, paymentStatus },
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Order updated successfully.',
      order,
    });
  } catch (error) {
    next(error);
  }
};

export const assignDeliveryBoy = async (req, res, next) => {
  try {
    const { deliveryBoyId, note = '' } = req.body;

    if (!deliveryBoyId) {
      return next(new AppError('Delivery partner is required.', 400));
    }

    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('assignedDeliveryBoy', 'name email phone');

    if (!order) {
      return next(new AppError('Order not found.', 404));
    }

    if (!['under_process', 'packed', 'shipped'].includes(order.orderStatus)) {
      return next(
        new AppError('Delivery partner can only be assigned after order is under process.', 400)
      );
    }

    const deliveryBoy = await DeliveryBoy.findById(deliveryBoyId);

    if (!deliveryBoy) {
      return next(new AppError('Delivery partner not found.', 404));
    }

    if (!deliveryBoy.isActive) {
      return next(new AppError('Selected delivery partner is inactive.', 400));
    }

    order.assignedDeliveryBoy = deliveryBoy._id;
    order.deliveryStatus = 'assigned';
    order.deliveryAssignedAt = new Date();

    order.statusTimeline.push({
      status: 'assigned',
      note: note.trim() || `Order assigned to ${deliveryBoy.name}.`,
      changedAt: new Date(),
      changedBy: 'admin',
    });

    await order.save();

    await createNotification({
      recipientType: 'delivery',
      deliveryBoy: deliveryBoy._id,
      order: order._id,
      title: 'New order assigned',
      message: `You have been assigned order ${order._id}.`,
      type: 'assignment',
      meta: { orderId: order._id },
    });

    await createNotification({
      recipientType: 'user',
      user: order.user?._id || order.user,
      order: order._id,
      title: 'Delivery partner assigned',
      message: `${deliveryBoy.name} has been assigned to your order.`,
      type: 'assignment',
      meta: {
        orderId: order._id,
        deliveryBoyName: deliveryBoy.name,
        deliveryBoyPhone: deliveryBoy.phone,
      },
    });

    await createNotification({
      recipientType: 'admin',
      order: order._id,
      title: 'Delivery partner assigned',
      message: `${deliveryBoy.name} was assigned to order ${order._id}.`,
      type: 'assignment',
      meta: { orderId: order._id, deliveryBoyName: deliveryBoy.name },
    });

    const updatedOrder = await Order.findById(order._id)
      .populate('user', 'name email phone')
      .populate('assignedDeliveryBoy', 'name email phone isAvailable');

    return res.status(200).json({
      success: true,
      message: 'Delivery partner assigned successfully.',
      order: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

export const deliveryUpdateStatus = async (req, res, next) => {
  try {
    const { status, note = '' } = req.body;

    const allowedDeliveryActions = ['accepted', 'packed', 'shipped', 'delivered'];

    if (!allowedDeliveryActions.includes(status)) {
      return next(new AppError('Invalid delivery status update.', 400));
    }

    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('assignedDeliveryBoy', 'name email phone');

    if (!order) {
      return next(new AppError('Order not found.', 404));
    }

    if (!order.assignedDeliveryBoy) {
      return next(new AppError('No delivery partner assigned to this order.', 400));
    }

    if (String(order.assignedDeliveryBoy._id) !== String(req.deliveryBoy._id)) {
      return next(new AppError('This order is not assigned to you.', 403));
    }

    if (status === 'accepted') {
      if (order.deliveryStatus === 'accepted') {
        return next(new AppError('Order already accepted by you.', 400));
      }

      order.deliveryStatus = 'accepted';
      order.deliveryAcceptedAt = new Date();
      order.statusTimeline.push({
        status: 'accepted',
        note: note.trim() || `${req.deliveryBoy.name} accepted this delivery.`,
        changedAt: new Date(),
        changedBy: 'delivery',
      });
    }

    if (status === 'packed') {
      if (!['under_process', 'placed', 'packed'].includes(order.orderStatus)) {
        return next(new AppError('Order cannot be marked packed at this stage.', 400));
      }

      order.orderStatus = 'packed';
      order.statusTimeline.push({
        status: 'packed',
        note: note.trim() || buildTimelineNote('packed'),
        changedAt: new Date(),
        changedBy: 'delivery',
      });
    }

    if (status === 'shipped') {
      if (order.orderStatus !== 'packed') {
        return next(new AppError('Order must be packed before shipping.', 400));
      }

      order.orderStatus = 'shipped';
      order.deliveryStatus = 'out_for_delivery';
      order.statusTimeline.push({
        status: 'shipped',
        note: note.trim() || buildTimelineNote('shipped'),
        changedAt: new Date(),
        changedBy: 'delivery',
      });
    }

    if (status === 'delivered') {
      if (order.orderStatus !== 'shipped') {
        return next(new AppError('Order must be shipped before delivery.', 400));
      }

      order.orderStatus = 'delivered';
      order.deliveryStatus = 'completed';
      order.deliveryCompletedAt = new Date();
      order.deliveredAt = new Date();
      order.statusTimeline.push({
        status: 'delivered',
        note: note.trim() || buildTimelineNote('delivered'),
        changedAt: new Date(),
        changedBy: 'delivery',
      });
    }

    await order.save();

    await createNotification({
      recipientType: 'admin',
      order: order._id,
      title: 'Delivery update received',
      message: `${req.deliveryBoy.name} updated order ${order._id} to ${status}.`,
      type: 'delivery',
      meta: {
        orderId: order._id,
        deliveryBoyName: req.deliveryBoy.name,
        status,
      },
    });

    await createNotification({
      recipientType: 'user',
      user: order.user?._id || order.user,
      order: order._id,
      title: 'Order update',
      message:
        status === 'accepted'
          ? `${req.deliveryBoy.name} accepted your delivery.`
          : `Your order is now ${status.replace(/_/g, ' ')}.`,
      type: 'delivery',
      meta: {
        orderId: order._id,
        deliveryBoyName: req.deliveryBoy.name,
        status,
      },
    });

    const updatedOrder = await Order.findById(order._id)
      .populate('user', 'name email phone')
      .populate('assignedDeliveryBoy', 'name email phone isAvailable');

    return res.status(200).json({
      success: true,
      message: 'Delivery status updated successfully.',
      order: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyDeliveryOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      assignedDeliveryBoy: req.deliveryBoy._id,
      orderStatus: { $ne: 'cancelled' },
    })
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