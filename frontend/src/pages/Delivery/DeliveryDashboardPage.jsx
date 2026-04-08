import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getCurrentDelivery,
  getDeliveryNotifications,
  getMyDeliveryOrders,
  logoutDelivery,
  updateDeliveryOrderStatus,
} from '../../utils/api';
import { formatCurrency, shortDate, titleCase } from '../../utils/format';

const actionButtons = [
  { key: 'accepted', label: 'Accept Order' },
  { key: 'packed', label: 'Mark Packed' },
  { key: 'shipped', label: 'Mark Shipped' },
  { key: 'delivered', label: 'Mark Delivered' },
];

const DeliveryDashboardPage = () => {
  const navigate = useNavigate();
  const [deliveryBoy, setDeliveryBoy] = useState(null);
  const [orders, setOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState('');
  const [error, setError] = useState('');

  const loadPageData = async () => {
    try {
      setLoading(true);

      const [meResponse, ordersResponse, notificationsResponse] = await Promise.all([
        getCurrentDelivery(),
        getMyDeliveryOrders(),
        getDeliveryNotifications(),
      ]);

      setDeliveryBoy(meResponse?.data?.deliveryBoy || null);
      setOrders(ordersResponse?.orders || []);
      setNotifications(notificationsResponse?.notifications || []);
      setError('');
    } catch (err) {
      console.error(err);
      setError(err?.message || 'Failed to load delivery dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPageData();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutDelivery();
    } catch (err) {
      console.error(err);
    } finally {
      navigate('/delivery/login', { replace: true });
    }
  };

  const handleAction = async (orderId, status) => {
    try {
      setSavingId(`${orderId}-${status}`);
      await updateDeliveryOrderStatus(orderId, { status });
      await loadPageData();
    } catch (err) {
      alert(err?.message || 'Failed to update delivery status.');
    } finally {
      setSavingId('');
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f7fb] py-8">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-stone">
              Delivery dashboard
            </p>
            <h1 className="mt-2 font-serif-display text-4xl text-charcoal">
              Welcome {deliveryBoy?.name || 'Delivery Partner'}
            </h1>
            <p className="mt-2 text-sm text-stone">
              Accept assigned deliveries, update packed, shipped, and delivered
              status, and keep admin and user notified.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-charcoal px-5 py-3 text-xs uppercase tracking-[0.24em] text-charcoal transition hover:bg-charcoal hover:text-ivory"
          >
            Logout
          </button>
        </div>

        {error ? (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="rounded-2xl border border-black/5 bg-white p-8 text-stone">
            Loading delivery dashboard...
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
            <div className="space-y-6">
              {orders.length ? (
                orders.map((order) => (
                  <div
                    key={order._id}
                    className="rounded-[1.5rem] border border-black/5 bg-white p-5 shadow-sm"
                  >
                    <div className="grid gap-4 border-b border-silk pb-5 md:grid-cols-4">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.24em] text-stone">
                          Customer
                        </p>
                        <p className="mt-2 font-medium text-charcoal">
                          {order.user?.name || '-'}
                        </p>
                        <p className="text-stone">{order.user?.phone || '-'}</p>
                      </div>

                      <div>
                        <p className="text-[11px] uppercase tracking-[0.24em] text-stone">
                          Date
                        </p>
                        <p className="mt-2 text-charcoal">
                          {shortDate(order.createdAt)}
                        </p>
                      </div>

                      <div>
                        <p className="text-[11px] uppercase tracking-[0.24em] text-stone">
                          Order Status
                        </p>
                        <p className="mt-2 text-charcoal">
                          {titleCase(order.orderStatus)}
                        </p>
                      </div>

                      <div>
                        <p className="text-[11px] uppercase tracking-[0.24em] text-stone">
                          Total
                        </p>
                        <p className="mt-2 text-charcoal">
                          {formatCurrency(order.totalAmount)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_330px]">
                      <div>
                        <p className="mb-3 text-[11px] uppercase tracking-[0.24em] text-stone">
                          Delivery Address
                        </p>

                        <div className="rounded-2xl border border-silk bg-ivory p-4 text-sm leading-7 text-stone">
                          <p className="font-medium text-charcoal">
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

                        <div className="mt-5 rounded-2xl border border-silk bg-[#fcfcfc] p-4">
                          <p className="mb-3 text-[11px] uppercase tracking-[0.24em] text-stone">
                            Timeline
                          </p>

                          <div className="space-y-3">
                            {order.statusTimeline?.length ? (
                              [...order.statusTimeline]
                                .slice()
                                .reverse()
                                .map((entry, index) => (
                                  <div
                                    key={`${entry.status}-${index}`}
                                    className="rounded-xl border border-silk bg-white px-4 py-3"
                                  >
                                    <div className="flex items-start justify-between gap-4">
                                      <div>
                                        <p className="text-sm font-medium text-charcoal">
                                          {titleCase(entry.status)}
                                        </p>
                                        <p className="mt-1 text-sm text-stone">
                                          {entry.note || 'Status updated'}
                                        </p>
                                        <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-stone">
                                          By {titleCase(entry.changedBy || 'system')}
                                        </p>
                                      </div>

                                      <p className="whitespace-nowrap text-xs text-stone">
                                        {entry.changedAt
                                          ? new Date(
                                              entry.changedAt
                                            ).toLocaleString('en-IN')
                                          : ''}
                                      </p>
                                    </div>
                                  </div>
                                ))
                            ) : (
                              <p className="text-sm text-stone">
                                No updates yet.
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className="mb-3 text-[11px] uppercase tracking-[0.24em] text-stone">
                          Delivery Actions
                        </p>

                        <div className="space-y-3 rounded-2xl border border-silk bg-ivory p-4">
                          {actionButtons.map((action) => (
                            <button
                              key={action.key}
                              type="button"
                              onClick={() => handleAction(order._id, action.key)}
                              disabled={savingId === `${order._id}-${action.key}`}
                              className="w-full rounded-full border border-charcoal px-4 py-3 text-xs uppercase tracking-[0.22em] text-charcoal transition hover:bg-charcoal hover:text-ivory disabled:opacity-60"
                            >
                              {savingId === `${order._id}-${action.key}`
                                ? 'Updating...'
                                : action.label}
                            </button>
                          ))}

                          <div className="rounded-xl border border-silk bg-white p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-stone">
                              Current delivery status
                            </p>
                            <p className="mt-2 text-sm font-medium text-charcoal">
                              {titleCase(order.deliveryStatus || 'unassigned')}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[1.5rem] border border-black/5 bg-white p-8 text-stone">
                  No assigned orders yet.
                </div>
              )}
            </div>

            <aside className="rounded-[1.5rem] border border-black/5 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-charcoal">
                  Notifications
                </h2>
                <span className="rounded-full border border-silk px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-stone">
                  {notifications.length}
                </span>
              </div>

              <div className="mt-4 max-h-[700px] space-y-3 overflow-auto pr-1">
                {notifications.length ? (
                  notifications.map((item) => (
                    <div
                      key={item._id}
                      className="rounded-2xl border border-silk bg-[#fafafa] p-4"
                    >
                      <p className="text-sm font-medium text-charcoal">
                        {item.title}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-stone">
                        {item.message}
                      </p>
                      <p className="mt-2 text-xs text-stone">
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleString('en-IN')
                          : ''}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-silk bg-[#fafafa] p-4 text-sm text-stone">
                    No notifications yet.
                  </div>
                )}
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryDashboardPage;