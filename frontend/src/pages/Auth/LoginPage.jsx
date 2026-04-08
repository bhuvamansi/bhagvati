import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { unifiedLogin } from '../../utils/unifiedAuth';

const LoginPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError('');

      const result = await unifiedLogin({
        email: formData.email.trim(),
        password: formData.password,
      });

      const redirectTo = result?.redirectTo || '/';

      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Login failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f3ed] grid place-items-center px-6 py-12">
      <div className="w-full max-w-md rounded-[2rem] border border-black/5 bg-white p-8 shadow-sm">
        <p className="text-xs uppercase tracking-[0.26em] text-stone">
          Single Login
        </p>

        <h1 className="mt-3 font-serif-display text-4xl text-charcoal">
          Login
        </h1>

        <p className="mt-3 text-sm leading-7 text-stone">
          User, admin, and delivery partner all log in from this one page.
          You will be redirected automatically to your correct dashboard.
        </p>

        {error ? (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.22em] text-stone">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-2xl border border-silk bg-white px-4 py-3 outline-none"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.22em] text-stone">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-2xl border border-silk bg-white px-4 py-3 outline-none"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-charcoal px-6 py-4 text-xs uppercase tracking-[0.24em] text-ivory transition hover:opacity-90 disabled:opacity-60"
          >
            {submitting ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between gap-3 text-sm">
          <Link to="/forgot-password" className="text-stone hover:text-charcoal">
            Forgot password?
          </Link>

          <Link to="/register" className="text-charcoal font-medium">
            Create user account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;