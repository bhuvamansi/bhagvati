import React, { useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/format';

const paymentMethods = [
  {
    key: 'card',
    label: 'Credit / Debit Card',
    description: 'Visa, MasterCard, RuPay, American Express',
  },
  {
    key: 'upi',
    label: 'UPI',
    description: 'Google Pay, PhonePe, Paytm, BHIM',
  },
  {
    key: 'netbanking',
    label: 'Net Banking',
    description: 'All major Indian banks',
  },
  {
    key: 'wallet',
    label: 'Wallets',
    description: 'Paytm Wallet, Amazon Pay, Mobikwik',
  },
  {
    key: 'cod',
    label: 'Cash on Delivery',
    description: 'Pay at your doorstep',
  },
  {
    key: 'emi',
    label: 'EMI',
    description: 'No-cost EMI / Card EMI options',
  },
  {
    key: 'banktransfer',
    label: 'Bank Transfer',
    description: 'Direct transfer to merchant account',
  },
];

const CheckoutPage = () => {
  const { items, totalItems, totalPrice } = useCart();

  const [selectedPayment, setSelectedPayment] = useState('card');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',

    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',

    upiId: '',

    bankName: '',

    walletName: '',

    emiPlan: '',

    transferReference: '',
  });

  const shipping = useMemo(() => {
    return totalPrice > 50000 ? 0 : 999;
  }, [totalPrice]);

  const discount = useMemo(() => {
    return promoApplied ? Math.round(totalPrice * 0.1) : 0;
  }, [promoApplied, totalPrice]);

  const finalTotal = useMemo(() => {
    return totalPrice + shipping - discount;
  }, [totalPrice, shipping, discount]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleApplyPromo = () => {
    if (promoCode.trim().toLowerCase() === 'furniture10') {
      setPromoApplied(true);
    } else {
      setPromoApplied(false);
      alert('Invalid promo code');
    }
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    const requiredFields = [
      'firstName',
      'lastName',
      'email',
      'phone',
      'address',
      'city',
      'state',
      'pincode',
    ];

    const emptyField = requiredFields.find((field) => !formData[field]?.trim());

    if (emptyField) {
      alert('Please fill all required delivery details.');
      return;
    }

    if (selectedPayment === 'card') {
      if (
        !formData.cardName.trim() ||
        !formData.cardNumber.trim() ||
        !formData.expiry.trim() ||
        !formData.cvv.trim()
      ) {
        alert('Please complete card details.');
        return;
      }
    }

    if (selectedPayment === 'upi' && !formData.upiId.trim()) {
      alert('Please enter your UPI ID.');
      return;
    }

    if (selectedPayment === 'netbanking' && !formData.bankName.trim()) {
      alert('Please enter your bank name.');
      return;
    }

    if (selectedPayment === 'wallet' && !formData.walletName.trim()) {
      alert('Please choose your wallet.');
      return;
    }

    if (selectedPayment === 'emi' && !formData.emiPlan.trim()) {
      alert('Please select an EMI plan.');
      return;
    }

    if (selectedPayment === 'banktransfer' && !formData.transferReference.trim()) {
      alert('Please enter transfer reference / note.');
      return;
    }


    try {
      setIsPlacingOrder(true);

      const payload = {
        items: items.map((item) => ({
          _id: item._id,
          product: item._id,
          name: item.name,
          img: item.img,
          image: item.img,
          price: item.price,
          qty: item.qty,
        })),
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          apartment: formData.apartment,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          country: formData.country,
        },
        paymentMethod: selectedPayment,
        paymentDetails: {
          cardName: formData.cardName,
          upiId: formData.upiId,
          bankName: formData.bankName,
          walletName: formData.walletName,
          emiPlan: formData.emiPlan,
          transferReference: formData.transferReference,
        },
        subtotal: totalPrice,
        shippingFee: shipping,
        discount,
        totalAmount: finalTotal,
        promoCode: promoApplied ? promoCode : '',
      };

      // if (data?.success) {
      //   dispatch({ type: 'CLEAR_CART' });
      //   navigate(`/order-success/${data.order._id}`, {
      //     state: { order: data.order },
      //   });
      //   return;
      // }

      // alert(data?.message || 'Failed to place order');
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || 'Something went wrong while placing order');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (!items.length) {
    return <Navigate to="/cart" replace />;
  }

  return (
    <div className="pt-20 pb-28">
      <div className="max-w-screen-xl mx-auto px-8 lg:px-16">
        <div className="mb-5 border-b border-silk pb-1">
          <Link
            to="/cart"
            className="inline-block mb-4 font-sans text-xs tracking-widest uppercase text-stone hover:text-charcoal transition-colors duration-300"
          >
            ← Back to Cart
          </Link>
          <h1 className="font-serif-display text-5xl lg:text-6xl font-light text-charcoal tracking-wide">
            Checkout ({totalItems})
          </h1>
          <p className="tracking-label text-stone mb-2">Secure Checkout</p>
        </div>
        <form
          onSubmit={handlePlaceOrder}
          className="grid grid-cols-1 lg:grid-cols-3 gap-16"
        >
          <div className="lg:col-span-2 space-y-10">
            <section className="border border-silk p-8">
              <p className="tracking-label text-stone mb-8">Contact Details</p>

              <div className="grid gap-5 sm:grid-cols-2">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="border border-silk px-4 py-4 font-sans text-sm text-charcoal outline-none transition-colors duration-300 focus:border-charcoal"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="border border-silk px-4 py-4 font-sans text-sm text-charcoal outline-none transition-colors duration-300 focus:border-charcoal"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                  className="sm:col-span-2 border border-silk px-4 py-4 font-sans text-sm text-charcoal outline-none transition-colors duration-300 focus:border-charcoal"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="sm:col-span-2 border border-silk px-4 py-4 font-sans text-sm text-charcoal outline-none transition-colors duration-300 focus:border-charcoal"
                />
              </div>
            </section>

            <section className="border border-silk p-8">
              <p className="tracking-label text-stone mb-8">Delivery Address</p>

              <div className="grid gap-5 sm:grid-cols-2">
                <input
                  type="text"
                  name="address"
                  placeholder="Street address"
                  value={formData.address}
                  onChange={handleChange}
                  className="sm:col-span-2 border border-silk px-4 py-4 font-sans text-sm text-charcoal outline-none transition-colors duration-300 focus:border-charcoal"
                />
                <input
                  type="text"
                  name="apartment"
                  placeholder="Apartment, suite, landmark"
                  value={formData.apartment}
                  onChange={handleChange}
                  className="sm:col-span-2 border border-silk px-4 py-4 font-sans text-sm text-charcoal outline-none transition-colors duration-300 focus:border-charcoal"
                />
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  className="border border-silk px-4 py-4 font-sans text-sm text-charcoal outline-none transition-colors duration-300 focus:border-charcoal"
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleChange}
                  className="border border-silk px-4 py-4 font-sans text-sm text-charcoal outline-none transition-colors duration-300 focus:border-charcoal"
                />
                <input
                  type="text"
                  name="pincode"
                  placeholder="Pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  className="border border-silk px-4 py-4 font-sans text-sm text-charcoal outline-none transition-colors duration-300 focus:border-charcoal"
                />
                <input
                  type="text"
                  name="country"
                  placeholder="Country"
                  value={formData.country}
                  onChange={handleChange}
                  className="border border-silk px-4 py-4 font-sans text-sm text-charcoal outline-none transition-colors duration-300 focus:border-charcoal"
                />
              </div>
            </section>

            <section className="border border-silk p-8">
              <p className="tracking-label text-stone mb-8">Payment Method</p>

              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <label
                    key={method.key}
                    className={`block cursor-pointer border p-5 transition-colors duration-300 ${selectedPayment === method.key
                        ? 'border-charcoal bg-[#f7f3ed]'
                        : 'border-silk bg-white hover:border-charcoal'
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={selectedPayment === method.key}
                        onChange={() => setSelectedPayment(method.key)}
                        className="mt-1"
                      />
                      <div>
                        <p className="font-sans text-sm uppercase tracking-wider text-charcoal">
                          {method.label}
                        </p>
                        <p className="mt-2 font-sans text-xs text-stone">
                          {method.description}
                        </p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              {selectedPayment === 'card' && (
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <input
                    type="text"
                    name="cardName"
                    placeholder="Name on card"
                    value={formData.cardName}
                    onChange={handleChange}
                    className="sm:col-span-2 border border-silk px-4 py-4 font-sans text-sm text-charcoal outline-none transition-colors duration-300 focus:border-charcoal"
                  />
                  <input
                    type="text"
                    name="cardNumber"
                    placeholder="Card number"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    className="sm:col-span-2 border border-silk px-4 py-4 font-sans text-sm text-charcoal outline-none transition-colors duration-300 focus:border-charcoal"
                  />
                  <input
                    type="text"
                    name="expiry"
                    placeholder="MM/YY"
                    value={formData.expiry}
                    onChange={handleChange}
                    className="border border-silk px-4 py-4 font-sans text-sm text-charcoal outline-none transition-colors duration-300 focus:border-charcoal"
                  />
                  <input
                    type="password"
                    name="cvv"
                    placeholder="CVV"
                    value={formData.cvv}
                    onChange={handleChange}
                    className="border border-silk px-4 py-4 font-sans text-sm text-charcoal outline-none transition-colors duration-300 focus:border-charcoal"
                  />
                </div>
              )}

              {selectedPayment === 'upi' && (
                <div className="mt-6">
                  <input
                    type="text"
                    name="upiId"
                    placeholder="Enter UPI ID (example@upi)"
                    value={formData.upiId}
                    onChange={handleChange}
                    className="w-full border border-silk px-4 py-4 font-sans text-sm text-charcoal outline-none transition-colors duration-300 focus:border-charcoal"
                  />
                </div>
              )}

              {selectedPayment === 'netbanking' && (
                <div className="mt-6">
                  <input
                    type="text"
                    name="bankName"
                    placeholder="Enter bank name"
                    value={formData.bankName}
                    onChange={handleChange}
                    className="w-full border border-silk px-4 py-4 font-sans text-sm text-charcoal outline-none transition-colors duration-300 focus:border-charcoal"
                  />
                </div>
              )}

              {selectedPayment === 'wallet' && (
                <div className="mt-6">
                  <select
                    name="walletName"
                    value={formData.walletName}
                    onChange={handleChange}
                    className="w-full border border-silk bg-white px-4 py-4 font-sans text-sm text-charcoal outline-none transition-colors duration-300 focus:border-charcoal"
                  >
                    <option value="">Select wallet</option>
                    <option value="Paytm">Paytm</option>
                    <option value="Amazon Pay">Amazon Pay</option>
                    <option value="Mobikwik">Mobikwik</option>
                    <option value="Freecharge">Freecharge</option>
                  </select>
                </div>
              )}

              {selectedPayment === 'emi' && (
                <div className="mt-6">
                  <select
                    name="emiPlan"
                    value={formData.emiPlan}
                    onChange={handleChange}
                    className="w-full border border-silk bg-white px-4 py-4 font-sans text-sm text-charcoal outline-none transition-colors duration-300 focus:border-charcoal"
                  >
                    <option value="">Select EMI plan</option>
                    <option value="3 Months">3 Months</option>
                    <option value="6 Months">6 Months</option>
                    <option value="9 Months">9 Months</option>
                    <option value="12 Months">12 Months</option>
                  </select>
                </div>
              )}

              {selectedPayment === 'banktransfer' && (
                <div className="mt-6">
                  <input
                    type="text"
                    name="transferReference"
                    placeholder="Enter transfer reference / remark"
                    value={formData.transferReference}
                    onChange={handleChange}
                    className="w-full border border-silk px-4 py-4 font-sans text-sm text-charcoal outline-none transition-colors duration-300 focus:border-charcoal"
                  />
                  <p className="mt-3 font-sans text-xs text-stone leading-6">
                    Use this after completing direct transfer so your order can be verified faster.
                  </p>
                </div>
              )}

              {selectedPayment === 'cod' && (
                <div className="mt-6 border border-silk p-4">
                  <p className="font-sans text-xs text-stone leading-6">
                    Cash on Delivery is available on selected locations and eligible order values.
                  </p>
                </div>
              )}
            </section>
          </div>

          <div className="lg:col-span-1">
            <div className="border border-silk p-8 sticky top-28">
              <p className="tracking-label text-stone mb-8">Order Summary</p>

              <div className="space-y-5 mb-8 border-b border-silk pb-8">
                {items.map((item) => (
                  <div key={item._id} className="flex gap-4">
                    <div
                      className="overflow-hidden shrink-0"
                      style={{ width: '80px', aspectRatio: '3/4' }}
                    >
                      <img
                        src={item.img}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-serif-display text-lg font-light text-charcoal tracking-wide">
                        {item.name}
                      </h3>
                      <p className="mt-1 font-sans text-xs text-stone">
                        Qty: {item.qty}
                      </p>
                      <p className="mt-2 font-sans text-xs text-charcoal">
                        {formatCurrency(item.price * item.qty)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mb-8">
                <p className="tracking-label text-stone mb-4">Promo Code</p>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter code"
                    className="min-w-0 flex-1 border border-silk px-4 py-3 font-sans text-sm text-charcoal outline-none transition-colors duration-300 focus:border-charcoal"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="border border-charcoal px-5 py-3 font-sans text-xs uppercase tracking-widest text-charcoal transition-colors duration-300 hover:bg-charcoal hover:text-ivory"
                  >
                    Apply
                  </button>
                </div>

                {promoApplied && (
                  <p className="mt-3 font-sans text-xs text-green-700">
                    Promo applied: 10% off
                  </p>
                )}
              </div>

              <div className="space-y-4 mb-10 border-t border-silk pt-8">
                <div className="flex justify-between">
                  <span className="font-sans text-xs text-stone tracking-wide">
                    Subtotal
                  </span>
                  <span className="font-sans text-xs text-charcoal tracking-wide">
                    {formatCurrency(totalPrice)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="font-sans text-xs text-stone tracking-wide">
                    Shipping
                  </span>
                  <span className="font-sans text-xs text-charcoal tracking-wide">
                    {shipping === 0 ? 'Free' : formatCurrency(shipping)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="font-sans text-xs text-stone tracking-wide">
                    Discount
                  </span>
                  <span className="font-sans text-xs text-charcoal tracking-wide">
                    - {formatCurrency(discount)}
                  </span>
                </div>

                <div className="flex justify-between pt-4 border-t border-silk">
                  <span className="font-sans text-xs tracking-widest uppercase text-charcoal">
                    Total
                  </span>
                  <span className="font-serif-display text-lg font-light text-charcoal">
                    {formatCurrency(finalTotal)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-full bg-charcoal px-6 py-4 mb-2 text-xs uppercase tracking-[0.28em] text-ivory transition hover:opacity-90"
              >
                Place Order
              </button>

              <Link
                to="/cart"
                className="block text-center font-sans text-xs tracking-widest uppercase text-stone hover:text-charcoal transition-colors duration-300 underline-link"
              >
                Return to Cart
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;