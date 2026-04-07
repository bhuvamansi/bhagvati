import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { formatCurrency } from '../../utils/format';

const OrderSuccessPage = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const order = location.state?.order;

  return (
    <div className="pt-32 pb-28">
      <div className="max-w-3xl mx-auto px-8 lg:px-16">
        <div className="border border-silk p-10 text-center">
          <p className="tracking-label text-stone mb-4">Order Confirmed</p>
          <h1 className="font-serif-display text-5xl font-light text-charcoal tracking-wide mb-6">
            Thank You
          </h1>

          <p className="font-sans text-sm text-stone leading-7 mb-4">
            Your order has been placed successfully.
          </p>

          <p className="font-sans text-xs uppercase tracking-widest text-charcoal mb-8">
            Order ID: {orderId}
          </p>

          {order && (
            <div className="border-t border-silk pt-8 text-left space-y-4">
              <div className="flex justify-between">
                <span className="font-sans text-xs text-stone tracking-wide">Payment Method</span>
                <span className="font-sans text-xs text-charcoal tracking-wide uppercase">
                  {order.paymentMethod}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="font-sans text-xs text-stone tracking-wide">Payment Status</span>
                <span className="font-sans text-xs text-charcoal tracking-wide uppercase">
                  {order.paymentStatus}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="font-sans text-xs text-stone tracking-wide">Order Status</span>
                <span className="font-sans text-xs text-charcoal tracking-wide uppercase">
                  {order.orderStatus}
                </span>
              </div>

              <div className="flex justify-between border-t border-silk pt-4">
                <span className="font-sans text-xs text-stone tracking-wide">Total</span>
                <span className="font-serif-display text-lg font-light text-charcoal">
                  {formatCurrency(order.totalAmount)}
                </span>
              </div>
            </div>
          )}

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="inline-flex items-center justify-center rounded-full bg-charcoal px-6 py-4 text-xs uppercase tracking-[0.28em] text-ivory transition hover:opacity-90"
            >
              Continue Shopping
            </Link>

            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-full border border-charcoal px-6 py-4 text-xs uppercase tracking-[0.28em] text-charcoal transition hover:bg-charcoal hover:text-ivory"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;