import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { getMyOrderById } from '../../utils/api';
import { formatCurrency, shortDate, titleCase } from '../../utils/format';

const steps = [
  { key: 'placed', label: 'Order Confirmed' },
  { key: 'under_process', label: 'Processing' },
  { key: 'packed', label: 'Packed' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' },
];

const formatTimelineDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const getEstimatedDelivery = (createdAt, status) => {
  if (!createdAt) return '';
  const created = new Date(createdAt);
  const daysToAdd =
    status === 'delivered' ? 0 :
    status === 'shipped' ? 1 :
    status === 'packed' ? 2 :
    status === 'under_process' ? 3 : 4;

  const estimated = new Date(created);
  estimated.setDate(estimated.getDate() + daysToAdd);

  return estimated.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    weekday: 'short',
  });
};

const OrderSuccessPage = () => {
  const { orderId } = useParams();
  const location = useLocation();

  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);
  const [showUpdates, setShowUpdates] = useState(false);
  const [showPlacedBanner, setShowPlacedBanner] = useState(Boolean(location.state?.justPlaced));

  useEffect(() => {
    if (!showPlacedBanner) return;
    const timer = setTimeout(() => setShowPlacedBanner(false), 3000);
    return () => clearTimeout(timer);
  }, [showPlacedBanner]);

  useEffect(() => {
    if (order) return;

    const loadOrder = async () => {
      try {
        setLoading(true);
        const response = await getMyOrderById(orderId);
        setOrder(response?.order || null);
      } catch (error) {
        console.error(error);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId, order]);

  const currentStepIndex = useMemo(() => {
    if (!order) return 0;
    const index = steps.findIndex((step) => step.key === order.orderStatus);
    return index === -1 ? 0 : index;
  }, [order]);

  const estimatedDelivery = useMemo(() => {
    if (!order) return '';
    return getEstimatedDelivery(order.createdAt, order.orderStatus);
  }, [order]);

  if (loading) {
    return (
      <div className="pt-28 pb-20 bg-[#f6f7fb]">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-white border rounded-2xl p-8 text-center text-stone">
            Loading order details...
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="pt-28 pb-20 bg-[#f6f7fb]">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-white border rounded-2xl p-8 text-center">
            <p className="text-stone mb-5">Order details could not be loaded.</p>
            <Link
              to="/orders"
              className="inline-flex items-center justify-center rounded-full bg-charcoal px-6 py-3 text-xs uppercase tracking-[0.25em] text-ivory"
            >
              Go To My Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const firstItem = order.items?.[0];

  return (
    <div className="pt-28 pb-20 bg-[#f6f7fb] min-h-screen">
      <div className="max-w-3xl mx-auto px-6 space-y-6">
        {showPlacedBanner && (
          <div className="rounded-2xl bg-green-600 px-5 py-4 text-white shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-lg font-bold">
                ✓
              </div>
              <div>
                <p className="text-sm font-semibold">Order placed successfully</p>
                <p className="text-xs text-green-100">
                  Your order has been confirmed and tracking is now active.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-[#dbe7ff] bg-white shadow-sm overflow-hidden">
          <div className="border-b border-silk bg-[#f8fbff] px-5 py-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-[#e7f7ea] text-green-700 font-bold">
                ✓
              </div>
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[0.22em] text-stone">
                  Order Successful
                </p>
                <h1 className="mt-1 text-xl font-semibold text-charcoal">
                  Order Confirmed
                </h1>
                <p className="mt-1 text-sm text-stone">
                  Your order has been placed successfully.
                </p>
              </div>
            </div>
          </div>

          <div className="px-5 py-4">
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="rounded-full border border-silk bg-white px-3 py-2 text-charcoal">
                Order ID: {order._id}
              </span>
              <span className="rounded-full border border-silk bg-white px-3 py-2 text-charcoal">
                Payment: {titleCase(order.paymentStatus)}
              </span>
              <span className="rounded-full border border-silk bg-white px-3 py-2 text-charcoal">
                Total: {formatCurrency(order.totalAmount)}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#dbe7ff] bg-white shadow-sm overflow-hidden">
          <div className="border-b border-silk px-5 py-4">
            <p className="text-lg font-semibold text-charcoal">Order Tracking</p>
            <p className="mt-1 text-sm text-stone">
              Expected delivery by {estimatedDelivery}
            </p>
          </div>

          <div className="px-5 py-5">
            <div className="rounded-2xl border border-[#dbe7ff] bg-[#f8fbff] p-4">
              <p className="text-sm text-stone mb-4">Your order is on the way</p>

              <div className="relative">
                <div className="absolute top-4 left-0 right-0 h-[2px] bg-[#d1d5db]" />
                <div
                  className="absolute top-4 left-0 h-[2px] bg-[#22c55e] transition-all duration-500"
                  style={{
                    width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
                  }}
                />

                <div className="relative grid grid-cols-5 gap-2">
                  {steps.map((step, index) => {
                    const active = index <= currentStepIndex;

                    return (
                      <div key={step.key} className="text-center">
                        <div
                          className={`mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full border text-[10px] font-bold ${
                            active
                              ? 'border-[#22c55e] bg-[#22c55e] text-white'
                              : 'border-[#d1d5db] bg-white text-stone'
                          }`}
                        >
                          {active ? '✓' : ''}
                        </div>

                        <p className="text-[10px] lg:text-[11px] text-stone leading-4">
                          {step.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowUpdates((prev) => !prev)}
                className="mt-4 text-sm font-medium text-[#2563eb] hover:underline"
              >
                {showUpdates ? 'Hide updates' : 'See all updates'}
              </button>

              {showUpdates && (
                <div className="mt-4 rounded-xl border border-silk bg-white p-4">
                  <div className="space-y-3">
                    {order.statusTimeline?.length ? (
                      [...order.statusTimeline].slice().reverse().map((entry, index) => (
                        <div
                          key={`${entry.status}-${index}`}
                          className="flex items-start justify-between gap-4 border-b border-silk pb-3 last:border-b-0 last:pb-0"
                        >
                          <div>
                            <p className="text-sm font-medium text-charcoal">
                              {titleCase(entry.status)}
                            </p>
                            <p className="mt-1 text-xs text-stone">
                              {entry.note || 'Order status updated'}
                            </p>
                          </div>
                          <p className="whitespace-nowrap text-xs text-stone">
                            {formatTimelineDate(entry.changedAt)}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-stone">No updates yet.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {firstItem && (
          <div className="rounded-2xl border border-silk bg-white p-5 shadow-sm">
            <div className="flex gap-4">
              <div className="h-24 w-20 overflow-hidden rounded-lg bg-[#f6f1ea] shrink-0">
                <img
                  src={firstItem.image}
                  alt={firstItem.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-lg font-semibold text-charcoal">{firstItem.name}</p>
                <p className="mt-1 text-sm text-stone">
                  Qty: {firstItem.qty}
                  {order.items.length > 1 ? ` • +${order.items.length - 1} more item(s)` : ''}
                </p>
                <p className="mt-2 text-sm font-medium text-charcoal">
                  {formatCurrency(firstItem.price * firstItem.qty)}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-silk bg-white p-5 shadow-sm">
            <p className="mb-3 text-sm font-semibold text-charcoal">Delivery Address</p>
            <div className="space-y-1 text-sm text-stone leading-6">
              <p className="font-medium text-charcoal">
                {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
              </p>
              <p>{order.shippingAddress?.address}</p>
              {order.shippingAddress?.apartment ? <p>{order.shippingAddress.apartment}</p> : null}
              <p>
                {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
              </p>
              <p>{order.shippingAddress?.country}</p>
              <p>{order.shippingAddress?.phone}</p>
              <p>{order.shippingAddress?.email}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-silk bg-white p-5 shadow-sm">
            <p className="mb-3 text-sm font-semibold text-charcoal">Payment & Summary</p>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-stone">Payment Method</span>
                <span className="text-charcoal">{titleCase(order.paymentMethod)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone">Payment Status</span>
                <span className="text-charcoal">{titleCase(order.paymentStatus)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone">Order Date</span>
                <span className="text-charcoal">{shortDate(order.createdAt)}</span>
              </div>
              <div className="flex justify-between border-t border-silk pt-3">
                <span className="text-stone">Total</span>
                <span className="font-semibold text-charcoal">{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            to="/products"
            className="inline-flex items-center justify-center rounded-full bg-charcoal px-6 py-4 text-center text-xs uppercase tracking-[0.22em] text-ivory"
          >
            Continue Shopping
          </Link>

          <Link
            to="/orders"
            className="inline-flex items-center justify-center rounded-full border border-charcoal px-6 py-4 text-center text-xs uppercase tracking-[0.22em] text-charcoal"
          >
            View Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;