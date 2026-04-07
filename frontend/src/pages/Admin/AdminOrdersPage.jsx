import React, { useEffect, useState } from 'react';
import { getAdminOrders, updateAdminOrderStatus } from '../../utils/api';
import { AdminShell } from '../../components/admin/AdminSection';
import { formatCurrency, shortDate, titleCase } from '../../utils/format';

const nextStatusMap = {
  placed: ['under_process', 'cancelled'],
  under_process: ['packed', 'cancelled'],
  packed: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
};

const paymentStatuses = ['pending', 'paid', 'failed', 'cod'];

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingId, setSavingId] = useState('');

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await getAdminOrders();
      setOrders(response?.orders || []);
      setError('');
    } catch (err) {
      setError(err?.message || 'Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (order, orderStatus) => {
    try {
      setSavingId(order._id);
      await updateAdminOrderStatus(order._id, { orderStatus });
      await loadOrders();
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
      await loadOrders();
    } catch (err) {
      alert(err?.message || 'Failed to update payment status.');
    } finally {
      setSavingId('');
    }
  };

  return (
    <AdminShell
      title="Orders"
      description="Manage placed orders and update order progress like Flipkart or Amazon."
    >
      {error ? <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div> : null}

      {loading ? (
        <div className="rounded-[1.5rem] border border-black/5 p-5">Loading orders...</div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
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

              <div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-stone mb-3">Items</p>
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
                </div>

                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-stone mb-3">Order Status</p>
                  <div className="rounded-2xl border border-silk bg-ivory p-4">
                    <p className="mb-3 text-sm text-charcoal">Current: {titleCase(order.orderStatus)}</p>
                    <select
                      className="w-full rounded-xl border border-silk bg-white px-3 py-3 outline-none"
                      value=""
                      onChange={(e) => e.target.value && handleStatusChange(order, e.target.value)}
                      disabled={savingId === order._id}
                    >
                      <option value="">Change order status</option>
                      {(nextStatusMap[order.orderStatus] || []).map((status) => (
                        <option key={status} value={status}>
                          {titleCase(status)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-stone mb-3">Payment Status</p>
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
                    <p className="mt-3 text-sm text-stone">Method: {titleCase(order.paymentMethod)}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {!orders.length && (
            <div className="rounded-[1.5rem] border border-black/5 p-5">No orders found.</div>
          )}
        </div>
      )}
    </AdminShell>
  );
};

export default AdminOrdersPage;