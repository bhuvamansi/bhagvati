import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const EyeIcon = ({ open }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    className="text-stone"
  >
    {open ? (
      <>
        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      <>
        <path d="M3 3l18 18" />
        <path d="M10.6 10.7a3 3 0 0 0 4.2 4.2" />
        <path d="M9.9 5.1A11.7 11.7 0 0 1 12 5c6.5 0 10 7 10 7a16.4 16.4 0 0 1-3.2 4.2" />
        <path d="M6.6 6.7C4.2 8.3 2.7 11 2 12c0 0 3.5 7 10 7 1.8 0 3.3-.5 4.7-1.2" />
      </>
    )}
  </svg>
);

const passwordChecks = (password) => ({
  length: password.length >= 8,
  upper: /[A-Z]/.test(password),
  lower: /[a-z]/.test(password),
  number: /\d/.test(password),
  special: /[@$!%*?&^#()_\-+=.]/.test(password),
});

const getPasswordError = (password, confirmPassword) => {
  if (!password || !confirmPassword) return '';

  const checks = passwordChecks(password);

  if (!checks.length) return 'Password must be at least 8 characters long.';
  if (!checks.upper || !checks.lower) return 'Password must include both uppercase and lowercase letters.';
  if (!checks.number) return 'Password must include at least one number.';
  if (!checks.special) return 'Password must include at least one special character.';
  if (password !== confirmPassword) return 'Passwords do not match.';

  return '';
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const passwordError = useMemo(
    () => getPasswordError(form.password, form.confirmPassword),
    [form.password, form.confirmPassword]
  );

  const formReady =
    form.name.trim() &&
    form.email.trim() &&
    form.password &&
    form.confirmPassword &&
    !passwordError;

  const handleChange = (e) => {
    setError('');
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formReady) return;

    setSubmitting(true);
    setError('');

    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
      });

      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-ivory px-6 pb-16 pt-32 md:px-10 lg:px-14">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-[8%] top-24 h-44 w-44 rounded-full bg-silk/70 blur-3xl" />
        <div className="absolute left-[10%] top-52 h-56 w-56 rounded-full bg-stone/10 blur-3xl" />
        <div className="absolute bottom-10 left-1/2 h-60 w-60 -translate-x-1/2 rounded-full bg-cream blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[2rem] border border-silk/80 bg-white/40 p-5 shadow-[0_20px_80px_rgba(26,26,24,0.08)] backdrop-blur-xl sm:p-7 md:p-8 lg:p-10">
          <div className="mb-8 flex rounded-full border border-charcoal/10 bg-white/60 p-1">
            <Link
              to="/login"
              className="flex-1 rounded-full px-5 py-3 text-center text-[11px] uppercase tracking-[0.32em] text-stone transition hover:text-charcoal"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="flex-1 rounded-full bg-charcoal px-5 py-3 text-center text-[11px] uppercase tracking-[0.32em] text-ivory"
            >
              Register
            </Link>
          </div>

          <div className="mb-8">
            <p className="tracking-label text-stone">Create Account</p>
            <h1 className="mt-3 font-serif-display text-4xl font-light tracking-wide text-charcoal md:text-5xl">
              Join the experience
            </h1>
            <p className="mt-3 text-sm leading-7 text-stone">
              Premium minimalism outside, real-world auth inside.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-[1.5rem] border border-charcoal/8 bg-ivory/80 px-5 py-4 md:col-span-2">
                <label className="mb-2 block text-[11px] uppercase tracking-[0.28em] text-stone">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  autoComplete="name"
                  required
                  className="w-full bg-transparent text-sm text-charcoal outline-none placeholder:text-stone/50"
                />
              </div>

              <div className="rounded-[1.5rem] border border-charcoal/8 bg-ivory/80 px-5 py-4">
                <label className="mb-2 block text-[11px] uppercase tracking-[0.28em] text-stone">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  className="w-full bg-transparent text-sm text-charcoal outline-none placeholder:text-stone/50"
                />
              </div>

              <div className="rounded-[1.5rem] border border-charcoal/8 bg-ivory/80 px-5 py-4">
                <label className="mb-2 block text-[11px] uppercase tracking-[0.28em] text-stone">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Optional"
                  autoComplete="tel"
                  className="w-full bg-transparent text-sm text-charcoal outline-none placeholder:text-stone/50"
                />
              </div>

              <div className="rounded-[1.5rem] border border-charcoal/8 bg-ivory/80 px-5 py-4">
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-[11px] uppercase tracking-[0.28em] text-stone">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-stone transition hover:text-charcoal"
                  >
                    <EyeIcon open={showPassword} />
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>

                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  required
                  className="w-full bg-transparent text-sm text-charcoal outline-none placeholder:text-stone/50"
                />
              </div>

              <div className="rounded-[1.5rem] border border-charcoal/8 bg-ivory/80 px-5 py-4">
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-[11px] uppercase tracking-[0.28em] text-stone">
                    Confirm Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-stone transition hover:text-charcoal"
                  >
                    <EyeIcon open={showConfirmPassword} />
                    {showConfirmPassword ? 'Hide' : 'Show'}
                  </button>
                </div>

                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                  required
                  className="w-full bg-transparent text-sm text-charcoal outline-none placeholder:text-stone/50"
                />
              </div>
            </div>

            {!!passwordError && (
              <div className="rounded-2xl border border-red-200 bg-red-50/70 px-4 py-3 text-sm text-red-500">
                {passwordError}
              </div>
            )}

            {!!error && (
              <div className="rounded-2xl border border-red-200 bg-red-50/70 px-4 py-3 text-sm text-red-500">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!formReady || submitting}
              className="w-full rounded-full border border-charcoal bg-charcoal px-6 py-4 text-[11px] uppercase tracking-[0.34em] text-ivory transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(26,26,24,0.14)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        </div>

        <div className="hidden rounded-[2rem] border border-silk/80 bg-white/35 p-10 shadow-[0_20px_80px_rgba(26,26,24,0.06)] backdrop-blur-xl lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-charcoal/10 bg-white/60 px-4 py-2 text-[11px] uppercase tracking-[0.35em] text-stone">
              New Member
            </div>

            <h2 className="font-serif-display max-w-md text-6xl leading-[0.95] text-charcoal">
              A softer luxury feel with a sharper user flow.
            </h2>

            <p className="mt-6 max-w-lg text-sm leading-7 text-stone">
              Clean forms, rounded depth, low-noise typography, and subtle motion language.
              This keeps the brand premium but still modern enough for 2026 taste.
            </p>
          </div>

          <div className="grid gap-4">
            {[
              'Minimal form experience with cleaner spacing',
              'Password rules handled silently through validation',
              'Real customer registration instead of admin-only login',
            ].map((item) => (
              <div
                key={item}
                className="rounded-[1.5rem] border border-charcoal/8 bg-ivory/70 p-5 text-sm leading-7 text-charcoal/80"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterPage;