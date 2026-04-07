import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/format';

const CartPage = () => {
  const { items, totalItems, totalPrice, dispatch } = useCart();

  if (items.length === 0) return (
    <div className="pt-40 pb-28 text-center">
      <p className="font-serif-display text-3xl font-light text-stone tracking-wide mb-6">Your cart is empty.</p>
      <Link to="/products" className="underline-link font-sans text-xs tracking-widest uppercase text-charcoal hover:text-stone transition-colors duration-300">Continue Shopping</Link>
    </div>
  );

  return (
    <div className="pt-32 pb-28">
      <div className="max-w-screen-xl mx-auto px-8 lg:px-16">
        <div className="mb-16 border-b border-silk pb-10">
          <p className="tracking-label text-stone mb-4">Your Selection</p>
          <h1 className="font-serif-display text-5xl lg:text-6xl font-light text-charcoal tracking-wide">Cart ({totalItems})</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2">
            {items.map((item) => (
              <div key={item._id} className="flex gap-8 py-8 border-b border-silk">
                <div className="img-hover overflow-hidden shrink-0" style={{ width: '120px', aspectRatio: '3/4' }}>
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif-display text-xl font-light text-charcoal tracking-wide mb-2">{item.name}</h3>
                    <p className="font-sans text-xs text-stone">{formatCurrency(item.price)}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 border border-silk">
                      <button onClick={() => item.qty > 1 ? dispatch({ type: 'UPDATE_QTY', payload: { id: item._id, qty: item.qty - 1 } }) : dispatch({ type: 'REMOVE_ITEM', payload: item._id })} className="px-3 py-2 font-sans text-xs text-stone hover:text-charcoal transition-colors duration-300">−</button>
                      <span className="font-sans text-xs text-charcoal w-4 text-center">{item.qty}</span>
                      <button onClick={() => dispatch({ type: 'UPDATE_QTY', payload: { id: item._id, qty: item.qty + 1 } })} className="px-3 py-2 font-sans text-xs text-stone hover:text-charcoal transition-colors duration-300">+</button>
                    </div>
                    <button onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item._id })} className="tracking-label text-stone hover:text-charcoal transition-colors duration-300">Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="border border-silk p-8">
              <p className="tracking-label text-stone mb-8">Order Summary</p>
              <div className="space-y-4 mb-8 border-b border-silk pb-8">
                {items.map((item) => (
                  <div key={item._id} className="flex justify-between">
                    <span className="font-sans text-xs text-stone tracking-wide">{item.name} ×{item.qty}</span>
                    <span className="font-sans text-xs text-charcoal tracking-wide">{formatCurrency(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mb-10">
                <span className="font-sans text-xs tracking-widest uppercase text-charcoal">Total</span>
                <span className="font-serif-display text-lg font-light text-charcoal">{formatCurrency(totalPrice)}</span>
              </div>
              <Link
                to="/checkout"
                className="inline-flex items-center justify-center rounded-full bg-charcoal px-6 py-4 mb-2 text-xs uppercase tracking-[0.28em] text-ivory transition hover:opacity-90"
              >
                Proceed to Checkout
              </Link>
              <Link to="/products" className="block text-center font-sans text-xs tracking-widest uppercase text-stone hover:text-charcoal transition-colors duration-300 underline-link">Continue Shopping</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
