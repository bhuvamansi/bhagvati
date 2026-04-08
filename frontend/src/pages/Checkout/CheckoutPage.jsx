import React, { useMemo, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { createOrder } from '../../utils/api';
import { formatCurrency } from '../../utils/format';
import toast from 'react-hot-toast';

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
  const navigate = useNavigate();
  const { items, totalItems, totalPrice, dispatch } = useCart();
  const { user, isAuthenticated, authLoading } = useAuth();

  const [selectedPayment, setSelectedPayment] = useState('card');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: user?.phone || '',
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

  const [errors, setErrors] = useState({});

  const shipping = useMemo(() => (totalPrice > 50000 ? 0 : 999), [totalPrice]);
  const discount = useMemo(() => (promoApplied ? Math.round(totalPrice * 0.1) : 0), [promoApplied, totalPrice]);
  const finalTotal = useMemo(() => totalPrice + shipping - discount, [totalPrice, shipping, discount]);

  const fieldLabels = {
    firstName: 'First name',
    lastName: 'Last name',
    email: 'Email',
    phone: 'Phone number',
    address: 'Street address',
    city: 'City',
    state: 'State',
    pincode: 'Pincode',
    country: 'Country',
    cardName: 'Name on card',
    cardNumber: 'Card number',
    expiry: 'Expiry',
    cvv: 'CVV',
    upiId: 'UPI ID',
    bankName: 'Bank name',
    walletName: 'Wallet',
    emiPlan: 'EMI plan',
    transferReference: 'Transfer reference',
  };

  const getInputClass = (fieldName, extra = '') =>
    `border px-4 py-4 font-sans text-sm text-charcoal outline-none ${
      errors[fieldName] ? 'border-red-500' : 'border-silk focus:border-charcoal'
    } ${extra}`;

  const renderError = (fieldName) =>
    errors[fieldName] ? (
      <p className="mt-2 text-xs text-red-600 font-sans">{errors[fieldName]}</p>
    ) : null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleApplyPromo = () => {
    if (promoCode.trim().toLowerCase() === 'furniture10') {
      setPromoApplied(true);
      toast.success('Promo code applied successfully!');
    } else {
      setPromoApplied(false);
      toast.error('Invalid promo code');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    const requiredFields = [
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

    requiredFields.forEach((field) => {
      if (!formData[field]?.trim()) {
        newErrors[field] = `${fieldLabels[field]} is required`;
      }
    });

    if (formData.email?.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    if (formData.phone?.trim()) {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(formData.phone.trim())) {
        newErrors.phone = 'Phone number must be 10 digits';
      }
    }

    if (formData.pincode?.trim()) {
      const pincodeRegex = /^[0-9]{6}$/;
      if (!pincodeRegex.test(formData.pincode.trim())) {
        newErrors.pincode = 'Pincode must be 6 digits';
      }
    }

    if (selectedPayment === 'card') {
      ['cardName', 'cardNumber', 'expiry', 'cvv'].forEach((field) => {
        if (!formData[field]?.trim()) {
          newErrors[field] = `${fieldLabels[field]} is required`;
        }
      });
    }

    if (selectedPayment === 'upi' && !formData.upiId.trim()) {
      newErrors.upiId = 'UPI ID is required';
    }

    if (selectedPayment === 'netbanking' && !formData.bankName.trim()) {
      newErrors.bankName = 'Bank name is required';
    }

    if (selectedPayment === 'wallet' && !formData.walletName.trim()) {
      newErrors.walletName = 'Wallet is required';
    }

    if (selectedPayment === 'emi' && !formData.emiPlan.trim()) {
      newErrors.emiPlan = 'EMI plan is required';
    }

    if (selectedPayment === 'banktransfer' && !formData.transferReference.trim()) {
      newErrors.transferReference = 'Transfer reference is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    const isValid = validateForm();

    if (!isValid) {
      toast.error('Please fill all required fields correctly.');
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

      const data = await createOrder(payload);

      if (data?.success && data?.order?._id) {
        dispatch({ type: 'CLEAR_CART' });

        toast.success('Order placed successfully!');

        setTimeout(() => {
          navigate(`/order-success/${data.order._id}`, {
            replace: true,
            state: {
              order: data.order,
              justPlaced: true,
            },
          });
        }, 1200);

        return;
      }

      toast.error(data?.message || 'Failed to place order');
    } catch (error) {
      console.error(error);
      toast.error(error?.message || 'Something went wrong while placing order');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (!items.length) {
    return <Navigate to="/cart" replace />;
  }

  if (!authLoading && !isAuthenticated) {
    return <Navigate to="/login" replace />;
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

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-10">
            <section className="border border-silk p-8">
              <p className="tracking-label text-stone mb-8">Contact Details</p>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={getInputClass('firstName', 'w-full')}
                  />
                  {renderError('firstName')}
                </div>

                <div>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={getInputClass('lastName', 'w-full')}
                  />
                  {renderError('lastName')}
                </div>

                <div className="sm:col-span-2">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={handleChange}
                    className={getInputClass('email', 'w-full')}
                  />
                  {renderError('email')}
                </div>

                <div className="sm:col-span-2">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    className={getInputClass('phone', 'w-full')}
                  />
                  {renderError('phone')}
                </div>
              </div>
            </section>

            <section className="border border-silk p-8">
              <p className="tracking-label text-stone mb-8">Delivery Address</p>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    name="address"
                    placeholder="Street address"
                    value={formData.address}
                    onChange={handleChange}
                    className={getInputClass('address', 'w-full')}
                  />
                  {renderError('address')}
                </div>

                <div className="sm:col-span-2">
                  <input
                    type="text"
                    name="apartment"
                    placeholder="Apartment, suite, landmark"
                    value={formData.apartment}
                    onChange={handleChange}
                    className="w-full border border-silk px-4 py-4 font-sans text-sm text-charcoal outline-none focus:border-charcoal"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                    className={getInputClass('city', 'w-full')}
                  />
                  {renderError('city')}
                </div>

                <div>
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleChange}
                    className={getInputClass('state', 'w-full')}
                  />
                  {renderError('state')}
                </div>

                <div>
                  <input
                    type="text"
                    name="pincode"
                    placeholder="Pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    className={getInputClass('pincode', 'w-full')}
                  />
                  {renderError('pincode')}
                </div>

                <div>
                  <input
                    type="text"
                    name="country"
                    placeholder="Country"
                    value={formData.country}
                    onChange={handleChange}
                    className={getInputClass('country', 'w-full')}
                  />
                  {renderError('country')}
                </div>
              </div>
            </section>

            <section className="border border-silk p-8">
              <p className="tracking-label text-stone mb-8">Payment Method</p>

              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <label
                    key={method.key}
                    className={`block cursor-pointer border p-5 transition-colors duration-300 ${
                      selectedPayment === method.key
                        ? 'border-charcoal bg-[#f7f3ed]'
                        : 'border-silk bg-white hover:border-charcoal'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={selectedPayment === method.key}
                        onChange={() => {
                          setSelectedPayment(method.key);
                          setErrors((prev) => ({
                            ...prev,
                            cardName: '',
                            cardNumber: '',
                            expiry: '',
                            cvv: '',
                            upiId: '',
                            bankName: '',
                            walletName: '',
                            emiPlan: '',
                            transferReference: '',
                          }));
                        }}
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
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      name="cardName"
                      placeholder="Name on card"
                      value={formData.cardName}
                      onChange={handleChange}
                      className={getInputClass('cardName', 'w-full')}
                    />
                    {renderError('cardName')}
                  </div>

                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      name="cardNumber"
                      placeholder="Card number"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      className={getInputClass('cardNumber', 'w-full')}
                    />
                    {renderError('cardNumber')}
                  </div>

                  <div>
                    <input
                      type="text"
                      name="expiry"
                      placeholder="MM/YY"
                      value={formData.expiry}
                      onChange={handleChange}
                      className={getInputClass('expiry', 'w-full')}
                    />
                    {renderError('expiry')}
                  </div>

                  <div>
                    <input
                      type="password"
                      name="cvv"
                      placeholder="CVV"
                      value={formData.cvv}
                      onChange={handleChange}
                      className={getInputClass('cvv', 'w-full')}
                    />
                    {renderError('cvv')}
                  </div>
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
                    className={getInputClass('upiId', 'w-full')}
                  />
                  {renderError('upiId')}
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
                    className={getInputClass('bankName', 'w-full')}
                  />
                  {renderError('bankName')}
                </div>
              )}

              {selectedPayment === 'wallet' && (
                <div className="mt-6">
                  <select
                    name="walletName"
                    value={formData.walletName}
                    onChange={handleChange}
                    className={getInputClass('walletName', 'w-full bg-white')}
                  >
                    <option value="">Select wallet</option>
                    <option value="Paytm">Paytm</option>
                    <option value="Amazon Pay">Amazon Pay</option>
                    <option value="Mobikwik">Mobikwik</option>
                    <option value="Freecharge">Freecharge</option>
                  </select>
                  {renderError('walletName')}
                </div>
              )}

              {selectedPayment === 'emi' && (
                <div className="mt-6">
                  <select
                    name="emiPlan"
                    value={formData.emiPlan}
                    onChange={handleChange}
                    className={getInputClass('emiPlan', 'w-full bg-white')}
                  >
                    <option value="">Select EMI plan</option>
                    <option value="3 Months">3 Months</option>
                    <option value="6 Months">6 Months</option>
                    <option value="9 Months">9 Months</option>
                    <option value="12 Months">12 Months</option>
                  </select>
                  {renderError('emiPlan')}
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
                    className={getInputClass('transferReference', 'w-full')}
                  />
                  {renderError('transferReference')}
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
                    <div className="overflow-hidden shrink-0" style={{ width: '80px', aspectRatio: '3 / 4' }}>
                      <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-serif-display text-lg font-light text-charcoal tracking-wide">
                        {item.name}
                      </h3>
                      <p className="mt-1 font-sans text-xs text-stone">Qty: {item.qty}</p>
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
                    className="min-w-0 flex-1 border border-silk px-4 py-3 font-sans text-sm text-charcoal outline-none focus:border-charcoal"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="border border-charcoal px-5 py-3 font-sans text-xs uppercase tracking-widest text-charcoal hover:bg-charcoal hover:text-ivory"
                  >
                    Apply
                  </button>
                </div>

                {promoApplied && (
                  <p className="mt-3 font-sans text-xs text-green-700">Promo applied: 10% off</p>
                )}
              </div>

              <div className="space-y-4 mb-10 border-t border-silk pt-8">
                <div className="flex justify-between">
                  <span className="font-sans text-xs text-stone tracking-wide">Subtotal</span>
                  <span className="font-sans text-xs text-charcoal tracking-wide">
                    {formatCurrency(totalPrice)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="font-sans text-xs text-stone tracking-wide">Shipping</span>
                  <span className="font-sans text-xs text-charcoal tracking-wide">
                    {shipping === 0 ? 'Free' : formatCurrency(shipping)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="font-sans text-xs text-stone tracking-wide">Discount</span>
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
                disabled={isPlacingOrder}
                className="inline-flex w-full items-center justify-center rounded-full bg-charcoal px-6 py-4 mb-2 text-xs uppercase tracking-[0.28em] text-ivory transition hover:opacity-90 disabled:opacity-60"
              >
                {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
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