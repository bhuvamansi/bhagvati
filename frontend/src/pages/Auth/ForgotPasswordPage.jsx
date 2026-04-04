import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotUserPassword } from '../../utils/api';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await forgotUserPassword({ email: email.trim() });
      setSuccessMessage(
        response?.message || 'If an account exists with this email, a reset link has been sent to the inbox.'
      );
    } catch (err) {
      setError(err.message || 'Failed to process forgot password request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-ivory px-6 pb-16 pt-32 md:px-10 lg:px-14">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[10%] top-32 h-40 w-40 rounded-full bg-silk/70 blur-3xl" />
        <div className="absolute right-[12%] top-24 h-56 w-56 rounded-full bg-stone/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-3xl rounded-[2rem] border border-silk/80 bg-white/45 p-5 shadow-[0_20px_80px_rgba(26,26,24,0.08)] backdrop-blur-xl sm:p-7 md:p-8 lg:p-10">
        <div className="mb-8">
          <p className="tracking-label text-stone">Password Recovery</p>
          <h1 className="mt-3 font-serif-display text-4xl font-light tracking-wide text-charcoal md:text-5xl">
            Reset access
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-stone">
            Enter your email address and we’ll send a secure password reset link to your inbox.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="rounded-[1.5rem] border border-charcoal/8 bg-ivory/80 px-5 py-4">
            <label className="mb-2 block text-[11px] uppercase tracking-[0.28em] text-stone">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              placeholder="you@example.com"
              required
              className="w-full bg-transparent text-sm text-charcoal outline-none placeholder:text-stone/50"
            />
          </div>

          {!!error && (
            <div className="rounded-2xl border border-red-200 bg-red-50/70 px-4 py-3 text-sm text-red-500">
              {error}
            </div>
          )}

          {!!successMessage && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 px-4 py-3 text-sm text-emerald-700">
              {successMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={!email.trim() || submitting}
            className="w-full rounded-full border border-charcoal bg-charcoal px-6 py-4 text-[11px] uppercase tracking-[0.34em] text-ivory transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(26,26,24,0.14)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Sending Link...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-[1.5rem] border border-charcoal/8 bg-white/55 p-5">
          <p className="text-sm text-charcoal/75">Remembered your password?</p>
          <Link
            to="/login"
            className="text-[11px] uppercase tracking-[0.28em] text-charcoal underline-link"
          >
            Back to login
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ForgotPasswordPage;