import React, { useEffect, useMemo, useState } from 'react';
import {
  assignAdminDeliveryBoy,
  getAdminNotifications,
  getAdminOrders,
  getDeliveryBoys,
  updateAdminOrderStatus,
} from '../../utils/api';
import { AdminShell } from '../../components/admin/AdminSection';
import { formatCurrency, shortDate, titleCase } from '../../utils/format';

const nextStatusMap = {
  placed: ['under_process', 'cancelled'],
  under_process: ['cancelled'],
  packed: [],
  shipped: [],
  delivered: [],
  cancelled: [],
};

const paymentStatuses = ['pending', 'paid', 'failed', 'cod'];

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

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingId, setSavingId] = useState('');
  const [assignMap, setAssignMap] = useState({});

  const loadPageData = async () => {
    try {
      setLoading(true);

      const [ordersResult, deliveryResult, notificationsResult] = await Promise.allSettled([
        getAdminOrders(),
        getDeliveryBoys(),
        getAdminNotifications(),
      ]);

      if (ordersResult.status === 'fulfilled') {
        setOrders(ordersResult.value?.orders || []);
      } else {
        console.error(ordersResult.reason);
      }

      if (deliveryResult.status === 'fulfilled') {
        setDeliveryBoys(deliveryResult.value?.deliveryBoys || []);
      } else {
        console.error(deliveryResult.reason);
      }

      if (notificationsResult.status === 'fulfilled') {
        setNotifications(notificationsResult.value?.notifications || []);
      } else {
        console.error(notificationsResult.reason);
      }

      if (ordersResult.status === 'rejected') {
        setError(ordersResult.reason?.message || 'Failed to load orders.');
      } else {
        setError('');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPageData();
  }, []);

  const availableDeliveryBoys = useMemo(
    () => deliveryBoys.filter((person) => person.isActive !== false),
    [deliveryBoys]
  );

  const handleStatusChange = async (order, orderStatus) => {
    try {
      setSavingId(order._id);
      await updateAdminOrderStatus(order._id, { orderStatus });
      await loadPageData();
    } catch (err) {
      alert(err?.message || 'Failed to update order status.');
    } finally {
      setSavingId('');
    }
  };

  const handlePaymentStatusChange = async (order, paymentStatus) => {
    try {
      setSavingId(order._id);
      await updateAdminOrderStatus(order._id, { paymentStatus });
      await loadPageData();
    } catch (err) {
      alert(err?.message || 'Failed to update payment status.');
    } finally {
      setSavingId('');
    }
  };

  const handleAssignDelivery = async (order) => {
    const deliveryBoyId = assignMap[order._id];

    if (!deliveryBoyId) {
      alert('Please select a delivery partner first.');
      return;
    }

    if (order.orderStatus !== 'under_process') {
      alert('Please move the order to Under Process first.');
      return;
    }

    try {
      setSavingId(order._id);
      await assignAdminDeliveryBoy(order._id, { deliveryBoyId });
      await loadPageData();
    } catch (err) {
      alert(err?.message || 'Failed to assign delivery partner.');
    } finally {
      setSavingId('');
    }
  };

  return (
    <AdminShell
      title="Orders"
      description="Manage placed orders, assign delivery partners, and track delivery activity in one place."
    >
      {error ? (
        <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      ) : null}

      <div className="mb-6 grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="rounded-[1.5rem] border border-black/5 bg-white p-5 shadow-sm">
          <p className="text-[11px] uppercase tracking-[0.24em] text-stone">Admin Note</p>
          <h2 className="mt-2 text-xl font-semibold text-charcoal">Order responsibility flow</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-silk bg-ivory p-4">
              <p className="text-sm font-semibold text-charcoal">Admin handles</p>
              <p className="mt-2 text-sm text-stone">Placed → Under Process → Assign Delivery</p>
            </div>
            <div className="rounded-2xl border border-silk bg-ivory p-4">
              <p className="text-sm font-semibold text-charcoal">Delivery handles</p>
              <p className="mt-2 text-sm text-stone">Accept → Packed → Shipped → Delivered</p>
            </div>
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-black/5 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-charcoal">Recent delivery activity</h2>
            <span className="rounded-full border border-silk px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-stone">
              {notifications.length}
            </span>
          </div>

          <div className="mt-4 max-h-[400px] space-y-3 overflow-auto pr-1">
            {notifications.length ? (
              notifications.map((item) => (
                <div key={item._id} className="rounded-2xl border border-silk bg-ivory p-4">
                  <p className="text-sm font-medium text-charcoal">{item.title}</p>
                  <p className="mt-1 text-sm text-stone leading-6">{item.message}</p>
                  <p className="mt-2 text-xs text-stone">
                    {item.createdAt ? new Date(item.createdAt).toLocaleString('en-IN') : ''}
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-silk bg-ivory p-4 text-sm text-stone">
                No notifications yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="rounded-[1.5rem] border border-black/5 p-5">Loading orders...</div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const isFinalState =
              order.orderStatus === 'delivered' || order.orderStatus === 'cancelled';

            const canAssignButton =
              order.orderStatus === 'under_process' &&
              order.deliveryStatus !== 'completed' &&
              order.orderStatus !== 'cancelled';

            return (
              <div
                key={order._id}
                className="rounded-[1.5rem] border border-black/5 bg-white p-5 shadow-sm"
              >
                <div className="grid gap-4 border-b border-silk pb-5 md:grid-cols-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.24em] text-stone">Customer</p>
                    <p className="mt-2 font-medium text-charcoal">{order.user?.name || 'User'}</p>
                    <p className="text-stone">{order.user?.email || '-'}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.24em] text-stone">Date</p>
                    <p className="mt-2 text-charcoal">{shortDate(order.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.24em] text-stone">Total</p>
                    <p className="mt-2 text-charcoal">{formatCurrency(order.totalAmount)}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.24em] text-stone">Items</p>
                    <p className="mt-2 text-charcoal">{order.items?.length || 0}</p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <span
                    className={`inline-flex items-center rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.2em] ${
                      statusBadgeMap[order.orderStatus] ||
                      'bg-stone-50 text-stone-700 border-stone-200'
                    }`}
                  >
                    {titleCase(order.orderStatus)}
                  </span>

                  <span className="inline-flex items-center rounded-full border border-silk px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-charcoal">
                    Payment {titleCase(order.paymentStatus)}
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

                <div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_0.9fr_0.9fr]">
                  <div>
                    <p className="mb-3 text-[11px] uppercase tracking-[0.24em] text-stone">Items</p>
                    <div className="space-y-3">
                      {order.items?.map((item, index) => (
                        <div
                          key={`${item.product}-${index}`}
                          className="flex items-center justify-between rounded-2xl border border-silk bg-ivory px-4 py-3"
                        >
                          <div>
                            <p className="font-medium text-charcoal">{item.name}</p>
                            <p className="text-sm text-stone">Qty: {item.qty}</p>
                          </div>
                          <p className="text-charcoal">{formatCurrency(item.price * item.qty)}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 rounded-2xl border border-silk bg-[#fcfcfc] p-4">
                      <p className="mb-3 text-[11px] uppercase tracking-[0.24em] text-stone">
                        Delivery assignment
                      </p>

                      {order.assignedDeliveryBoy ? (
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                          <p className="text-sm font-medium text-emerald-800">
                            Assigned to {order.assignedDeliveryBoy.name}
                          </p>
                          <p className="mt-1 text-sm text-emerald-700">
                            {order.assignedDeliveryBoy.email}
                          </p>
                          <p className="text-sm text-emerald-700">
                            {order.assignedDeliveryBoy.phone}
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <select
                            className="w-full rounded-xl border border-silk bg-white px-3 py-3 outline-none"
                            value={assignMap[order._id] || ''}
                            onChange={(e) =>
                              setAssignMap((prev) => ({
                                ...prev,
                                [order._id]: e.target.value,
                              }))
                            }
                            disabled={savingId === order._id || availableDeliveryBoys.length === 0}
                          >
                            <option value="">
                              {availableDeliveryBoys.length
                                ? 'Select delivery partner'
                                : 'No delivery partners found'}
                            </option>
                            {availableDeliveryBoys.map((person) => (
                              <option key={person._id} value={person._id}>
                                {person.name} • {person.phone}
                                {person.isAvailable === false ? ' • Unavailable' : ''}
                              </option>
                            ))}
                          </select>

                          <button
                            type="button"
                            onClick={() => handleAssignDelivery(order)}
                            disabled={!canAssignButton || savingId === order._id}
                            className="w-full rounded-full border border-charcoal px-4 py-3 text-xs uppercase tracking-[0.24em] text-charcoal transition hover:bg-charcoal hover:text-ivory disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {savingId === order._id ? 'Assigning...' : 'Assign Delivery Partner'}
                          </button>

                          <p className="text-xs text-stone">
                            {order.orderStatus !== 'under_process'
                              ? 'Set order to Under Process first, then click assign.'
                              : availableDeliveryBoys.length
                              ? `${availableDeliveryBoys.length} delivery partner(s) available in database.`
                              : 'No delivery partners are currently available in database.'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="mb-3 text-[11px] uppercase tracking-[0.24em] text-stone">Order Status</p>
                    <div className="rounded-2xl border border-silk bg-ivory p-4">
                      <p className="mb-3 text-sm text-charcoal">
                        Current: {titleCase(order.orderStatus)}
                      </p>

                      {isFinalState ? (
                        <div
                          className={`rounded-xl border px-4 py-3 text-sm ${
                            order.orderStatus === 'cancelled'
                              ? 'border-red-200 bg-red-50 text-red-700'
                              : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                          }`}
                        >
                          This order is in a final state and can no longer be changed.
                        </div>
                      ) : (
                        <>
                          <select
                            className="w-full rounded-xl border border-silk bg-white px-3 py-3 outline-none"
                            value=""
                            onChange={(e) => e.target.value && handleStatusChange(order, e.target.value)}
                            disabled={savingId === order._id}
                          >
                            <option value="">Change admin status</option>
                            {(nextStatusMap[order.orderStatus] || []).map((status) => (
                              <option key={status} value={status}>
                                {titleCase(status)}
                              </option>
                            ))}
                          </select>

                          <p className="mt-3 text-xs text-stone">
                            Packed, shipped and delivered are controlled from delivery panel.
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="mb-3 text-[11px] uppercase tracking-[0.24em] text-stone">Payment Status</p>
                    <div className="rounded-2xl border border-silk bg-ivory p-4">
                      <select
                        className="w-full rounded-xl border border-silk bg-white px-3 py-3 outline-none"
                        value={order.paymentStatus}
                        onChange={(e) => handlePaymentStatusChange(order, e.target.value)}
                        disabled={savingId === order._id}
                      >
                        {paymentStatuses.map((status) => (
                          <option key={status} value={status}>
                            {titleCase(status)}
                          </option>
                        ))}
                      </select>
                      <p className="mt-3 text-sm text-stone">
                        Method: {titleCase(order.paymentMethod)}
                      </p>

                      <div className="mt-4 rounded-xl border border-silk bg-white p-3">
                        <p className="text-xs uppercase tracking-[0.2em] text-stone">Shipping</p>
                        <p className="mt-2 text-sm text-charcoal">
                          {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                        </p>
                        <p className="text-sm text-stone">{order.shippingAddress?.phone}</p>
                        <p className="mt-1 text-sm text-stone">
                          {order.shippingAddress?.address}, {order.shippingAddress?.city}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-silk bg-[#fcfcfc] p-4">
                  <p className="mb-3 text-[11px] uppercase tracking-[0.24em] text-stone">Timeline</p>
                  <div className="space-y-3">
                    {order.statusTimeline?.length ? (
                      [...order.statusTimeline]
                        .slice()
                        .reverse()
                        .map((entry, index) => (
                          <div
                            key={`${entry.status}-${index}`}
                            className="flex items-start justify-between gap-4 rounded-xl border border-silk bg-white px-4 py-3"
                          >
                            <div>
                              <p className="text-sm font-medium text-charcoal">
                                {titleCase(entry.status)}
                              </p>
                              <p className="mt-1 text-sm text-stone">
                                {entry.note || 'Status updated'}
                              </p>
                              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-stone">
                                By {titleCase(entry.changedBy || 'system')}
                              </p>
                            </div>
                            <p className="whitespace-nowrap text-xs text-stone">
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
            );
          })}

          {!orders.length && (
            <div className="rounded-[1.5rem] border border-black/5 p-5">No orders found.</div>
          )}
        </div>
      )}
    </AdminShell>
  );
};

export default AdminOrdersPage;