import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  cancelMyOrder,
  getMyOrders,
  getUserNotifications,
} from '../../utils/api';
import { formatCurrency, shortDate, titleCase } from '../../utils/format';

const steps = ['placed', 'under_process', 'packed', 'shipped', 'delivered'];

const stepMeta = {
  placed: 'Order Confirmed',
  under_process: 'Processing',
  packed: 'Packed',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  assigned: 'Delivery Assigned',
  accepted: 'Accepted by Delivery',
};

const statusBadgeMap = {
  placed: 'bg-blue-50 text-blue-700 border-blue-200',
  under_process: 'bg-amber-50 text-amber-700 border-amber-200',
  packed: 'bg-violet-50 text-violet-700 border-violet-200',
  shipped: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
};

const deliveryStatusBadgeMap = {
  unassigned: 'bg-stone-50 text-stone-700 border-stone-200',
  assigned: 'bg-orange-50 text-orange-700 border-orange-200',
  accepted: 'bg-blue-50 text-blue-700 border-blue-200',
  out_for_delivery: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const cancellableStatuses = ['placed', 'under_process'];

const MyOrdersPage = () => {
  const { isAuthenticated, authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState('');
  const [cancellingId, setCancellingId] = useState('');

  const loadOrders = async () => {
    try {
      setLoading(true);
      const [ordersResponse, notificationsResponse] = await Promise.all([
        getMyOrders(),
        getUserNotifications(),
      ]);

      const orderList = ordersResponse?.orders || [];
      setOrders(orderList);
      setNotifications(notificationsResponse?.notifications || []);
      setExpandedOrderId((prev) => prev || orderList[0]?._id || '');
      setError('');
    } catch (err) {
      console.error(err);
      setError(err?.message || 'Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    loadOrders();
  }, [isAuthenticated]);

  const handleCancelOrder = async (order) => {
    const confirmed = window.confirm(
      'Are you sure you want to cancel this order?'
    );

    if (!confirmed) return;

    try {
      setCancellingId(order._id);
      await cancelMyOrder(order._id);
      await loadOrders();
      alert('Order cancelled successfully.');
    } catch (err) {
      console.error(err);
      alert(err?.message || 'Failed to cancel order.');
    } finally {
      setCancellingId('');
    }
  };

  if (!authLoading && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="pt-28 pb-20 bg-[#f6f7fb] min-h-screen">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.22em] text-stone mb-2">
            Order Tracking
          </p>
          <h1 className="font-serif-display text-5xl font-light text-charcoal">
            My Orders
          </h1>
        </div>

        {loading ? (
          <div className="bg-white border rounded-2xl p-8 text-center text-stone">
            Loading your orders...
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-600">
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white border rounded-2xl p-10 text-center">
            <p className="text-2xl font-semibold text-charcoal mb-3">No orders yet</p>
            <p className="text-stone mb-6">
              Place your first order and tracking will appear here.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center justify-center rounded-full bg-charcoal px-6 py-4 text-xs uppercase tracking-[0.24em] text-ivory"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
            <div className="space-y-6">
              {orders.map((order) => {
                const currentIndex = steps.findIndex((step) => step === order.orderStatus);
                const activeIndex = currentIndex === -1 ? 0 : currentIndex;
                const progressWidth =
                  order.orderStatus === 'cancelled'
                    ? '0%'
                    : `${(activeIndex / (steps.length - 1)) * 100}%`;

                const firstItem = order.items?.[0];
                const isExpanded = expandedOrderId === order._id;
                const canCancel = cancellableStatuses.includes(order.orderStatus);

                return (
                  <div
                    key={order._id}
                    className="bg-white border border-[#e5e7eb] rounded-2xl overflow-hidden shadow-sm"
                  >
                    <div className="p-5 lg:p-6 border-b border-silk">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-[0.22em] text-stone">
                            Order ID
                          </p>
                          <p className="mt-2 text-sm text-charcoal break-all">{order._id}</p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                          <span
                            className={`inline-flex items-center rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.2em] ${
                              statusBadgeMap[order.orderStatus] ||
                              'bg-stone-50 text-stone-700 border-stone-200'
                            }`}
                          >
                            {stepMeta[order.orderStatus] || titleCase(order.orderStatus)}
                          </span>

                          <span className="inline-flex items-center rounded-full border border-silk px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-charcoal bg-white">
                            {titleCase(order.paymentStatus)}
                          </span>

                          <span
                            className={`inline-flex items-center rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.2em] ${
                              deliveryStatusBadgeMap[order.deliveryStatus] ||
                              'bg-stone-50 text-stone-700 border-stone-200'
                            }`}
                          >
                            Delivery {titleCase(order.deliveryStatus || 'unassigned')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 lg:p-6">
                      <div className="grid gap-6 lg:grid-cols-[110px_1fr]">
                        <div>
                          {firstItem ? (
                            <div className="h-28 w-24 overflow-hidden rounded-lg bg-[#f6f1ea]">
                              <img
                                src={firstItem.image}
                                alt={firstItem.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          ) : null}
                        </div>

                        <div>
                          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                            <div>
                              <p className="text-lg font-semibold text-charcoal">
                                {firstItem?.name || 'Ordered item'}
                              </p>
                              <p className="mt-1 text-sm text-stone">
                                {order.items?.length || 0} item(s) • Ordered on{' '}
                                {shortDate(order.createdAt)}
                              </p>
                              <p className="mt-2 text-sm font-medium text-charcoal">
                                {formatCurrency(order.totalAmount)}
                              </p>
                            </div>

                            <div className="text-sm text-stone">
                              <p>
                                Payment:{' '}
                                <span className="text-charcoal">
                                  {titleCase(order.paymentMethod)}
                                </span>
                              </p>
                            </div>
                          </div>

                          {order.orderStatus !== 'cancelled' ? (
                            <div className="mt-6 rounded-xl border border-[#dbe7ff] bg-[#f8fbff] p-4">
                              <p className="text-sm font-medium text-charcoal mb-4">
                                Order Tracking
                              </p>

                              <div className="relative">
                                <div className="absolute top-4 left-0 right-0 h-[2px] bg-[#d1d5db]" />
                                <div
                                  className="absolute top-4 left-0 h-[2px] bg-[#22c55e] transition-all duration-500"
                                  style={{ width: progressWidth }}
                                />

                                <div className="relative grid grid-cols-5 gap-2">
                                  {steps.map((step, index) => {
                                    const active = index <= activeIndex;

                                    return (
                                      <div key={step} className="text-center">
                                        <div
                                          className={`mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full border text-[10px] ${
                                            active
                                              ? 'border-[#22c55e] bg-[#22c55e] text-white'
                                              : 'border-[#d1d5db] bg-white text-stone'
                                          }`}
                                        >
                                          {active ? '✓' : ''}
                                        </div>
                                        <p className="text-[10px] lg:text-[11px] text-stone leading-4">
                                          {stepMeta[step]}
                                        </p>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>

                              {order.assignedDeliveryBoy ? (
                                <div className="mt-4 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3">
                                  <p className="text-sm font-medium text-orange-800">
                                    Delivery Partner: {order.assignedDeliveryBoy.name}
                                  </p>
                                  <p className="mt-1 text-sm text-orange-700">
                                    {order.assignedDeliveryBoy.phone}
                                  </p>
                                  <p className="text-sm text-orange-700">
                                    {order.assignedDeliveryBoy.email}
                                  </p>
                                </div>
                              ) : null}
                            </div>
                          ) : (
                            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                              This order was cancelled.
                            </div>
                          )}

                          <div className="mt-6 flex flex-wrap gap-3">
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedOrderId((prev) => (prev === order._id ? '' : order._id))
                              }
                              className="inline-flex items-center justify-center rounded-full border border-charcoal px-5 py-3 text-xs uppercase tracking-[0.2em] text-charcoal transition hover:bg-charcoal hover:text-ivory"
                            >
                              {isExpanded ? 'Hide Details' : 'Track Order'}
                            </button>

                            {canCancel && (
                              <button
                                type="button"
                                onClick={() => handleCancelOrder(order)}
                                disabled={cancellingId === order._id}
                                className="inline-flex items-center justify-center rounded-full border border-red-300 px-5 py-3 text-xs uppercase tracking-[0.2em] text-red-600 transition hover:bg-red-600 hover:text-white disabled:opacity-60"
                              >
                                {cancellingId === order._id ? 'Cancelling...' : 'Cancel Order'}
                              </button>
                            )}

                            <Link
                              to="/products"
                              className="inline-flex items-center justify-center rounded-full border border-silk px-5 py-3 text-xs uppercase tracking-[0.2em] text-charcoal transition hover:border-charcoal"
                            >
                              Buy Again
                            </Link>
                          </div>

                          {isExpanded && (
                            <div className="mt-6 grid gap-6 lg:grid-cols-2">
                              <div className="rounded-xl border border-silk bg-white p-4">
                                <p className="text-sm font-semibold text-charcoal mb-3">
                                  Delivery Address
                                </p>
                                <div className="space-y-1 text-sm text-stone leading-6">
                                  <p className="text-charcoal font-medium">
                                    {order.shippingAddress?.firstName}{' '}
                                    {order.shippingAddress?.lastName}
                                  </p>
                                  <p>{order.shippingAddress?.address}</p>
                                  {order.shippingAddress?.apartment ? (
                                    <p>{order.shippingAddress.apartment}</p>
                                  ) : null}
                                  <p>
                                    {order.shippingAddress?.city},{' '}
                                    {order.shippingAddress?.state} -{' '}
                                    {order.shippingAddress?.pincode}
                                  </p>
                                  <p>{order.shippingAddress?.country}</p>
                                  <p>{order.shippingAddress?.phone}</p>
                                </div>
                              </div>

                              <div className="rounded-xl border border-silk bg-white p-4">
                                <p className="text-sm font-semibold text-charcoal mb-3">
                                  All Updates
                                </p>
                                <div className="space-y-3">
                                  {order.statusTimeline?.length ? (
                                    [...order.statusTimeline]
                                      .slice()
                                      .reverse()
                                      .map((entry, index) => (
                                        <div
                                          key={`${entry.status}-${index}`}
                                          className="flex items-start justify-between gap-4 border-b border-silk pb-3 last:border-b-0 last:pb-0"
                                        >
                                          <div>
                                            <p className="text-sm font-medium text-charcoal">
                                              {stepMeta[entry.status] ||
                                                titleCase(entry.status)}
                                            </p>
                                            <p className="text-xs text-stone mt-1">
                                              {entry.note || 'Order status updated'}
                                            </p>
                                            <p className="text-[10px] mt-1 uppercase tracking-[0.18em] text-stone">
                                              By {titleCase(entry.changedBy || 'system')}
                                            </p>
                                          </div>
                                          <p className="text-xs text-stone whitespace-nowrap">
                                            {entry.changedAt
                                              ? new Date(entry.changedAt).toLocaleString('en-IN')
                                              : ''}
                                          </p>
                                        </div>
                                      ))
                                  ) : (
                                    <p className="text-sm text-stone">No updates yet.</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}

                          {isExpanded && order.items?.length > 0 && (
                            <div className="mt-6 rounded-xl border border-silk bg-white p-4">
                              <p className="text-sm font-semibold text-charcoal mb-4">
                                Ordered Items
                              </p>

                              <div className="space-y-4">
                                {order.items.map((item, index) => (
                                  <div
                                    key={`${item.product}-${index}`}
                                    className="flex items-center gap-4 border-b border-silk pb-4 last:border-b-0 last:pb-0"
                                  >
                                    <div className="h-20 w-16 overflow-hidden rounded bg-[#f6f1ea]">
                                      <img
                                        src={item.image}
                                        alt={item.name}
                                        className="h-full w-full object-cover"
                                      />
                                    </div>

                                    <div className="flex-1">
                                      <h3 className="font-medium text-charcoal">
                                        {item.name}
                                      </h3>
                                      <p className="mt-1 text-xs uppercase tracking-wider text-stone">
                                        Qty: {item.qty}
                                      </p>
                                    </div>

                                    <div className="text-sm text-charcoal">
                                      {formatCurrency(item.price * item.qty)}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <aside className="space-y-6">
              <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-charcoal">Notifications</h2>
                  <span className="rounded-full border border-silk px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-stone">
                    {notifications.length}
                  </span>
                </div>

                <div className="mt-4 max-h-[700px] space-y-3 overflow-auto pr-1">
                  {notifications.length ? (
                    notifications.map((item) => (
                      <div key={item._id} className="rounded-2xl border border-silk bg-[#fafafa] p-4">
                        <p className="text-sm font-medium text-charcoal">{item.title}</p>
                        <p className="mt-1 text-sm text-stone leading-6">{item.message}</p>
                        <p className="mt-2 text-xs text-stone">
                          {item.createdAt ? new Date(item.createdAt).toLocaleString('en-IN') : ''}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-silk bg-[#fafafa] p-4 text-sm text-stone">
                      No notifications yet.
                    </div>
                  )}
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;