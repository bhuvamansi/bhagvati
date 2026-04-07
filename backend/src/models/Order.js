import Order from '../../models/Order.js';

export const createOrder = async (req, res) => {
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

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart items are required',
      });
    }

    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: 'Shipping address is required',
      });
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
        return res.status(400).json({
          success: false,
          message: `${field} is required`,
        });
      }
    }

    if (!paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Payment method is required',
      });
    }

    const normalizedItems = items.map((item) => ({
      product: item.product || item._id,
      name: item.name,
      image: item.image || item.img || '',
      price: Number(item.price) || 0,
      qty: Number(item.qty) || 1,
    }));

    const paymentStatus = paymentMethod === 'cod' ? 'cod' : 'pending';

    const order = await Order.create({
      user: req.user?._id || null,
      items: normalizedItems,
      shippingAddress,
      paymentMethod,
      paymentStatus,
      paymentDetails: paymentDetails || {},
      subtotal: Number(subtotal) || 0,
      shippingFee: Number(shippingFee) || 0,
      discount: Number(discount) || 0,
      totalAmount: Number(totalAmount) || 0,
      promoCode: promoCode || '',
      orderStatus: 'placed',
    });

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order,
    });
  } catch (error) {
    console.error('CREATE_ORDER_ERROR:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to place order',
    });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error('GET_MY_ORDERS_ERROR:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error('GET_ALL_ORDERS_ERROR:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch all orders',
    });
  }
};