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

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const formReady = useMemo(() => {
    return form.email.trim() && form.password.trim();
  }, [form]);

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
      await login({
        email: form.email.trim(),
        password: form.password,
      });

      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-ivory px-6 pb-16 pt-32 md:px-10 lg:px-14">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[8%] top-28 h-40 w-40 rounded-full bg-silk/70 blur-3xl" />
        <div className="absolute right-[10%] top-40 h-52 w-52 rounded-full bg-stone/10 blur-3xl" />
        <div className="absolute bottom-20 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-cream blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="hidden rounded-[2rem] border border-silk/80 bg-white/35 p-10 shadow-[0_20px_80px_rgba(26,26,24,0.06)] backdrop-blur-xl lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-charcoal/10 bg-white/60 px-4 py-2 text-[11px] uppercase tracking-[0.35em] text-stone">
              Member Access
            </div>

            <h1 className="font-serif-display max-w-md text-6xl leading-[0.95] text-charcoal">
              Sign in to your curated space.
            </h1>

            <p className="mt-6 max-w-lg text-sm leading-7 text-stone">
              Elevated, minimal, and secure. Your account gives you a smoother
              checkout, saved details, and a more premium store experience.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              ['Fast Checkout', 'Saved details for a smoother buying flow.'],
              ['Secure Access', 'JWT-based authentication with protected sessions.'],
              ['Modern UX', 'Clean interaction patterns with a luxury feel.'],
            ].map(([title, text]) => (
              <div
                key={title}
                className="rounded-[1.5rem] border border-charcoal/8 bg-ivory/70 p-5"
              >
                <p className="text-[11px] uppercase tracking-[0.28em] text-stone">{title}</p>
                <p className="mt-3 text-xs leading-6 text-charcoal/75">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-silk/80 bg-white/45 p-5 shadow-[0_20px_80px_rgba(26,26,24,0.08)] backdrop-blur-xl sm:p-7 md:p-8 lg:p-10">
          <div className="mb-8 flex rounded-full border border-charcoal/10 bg-white/60 p-1">
            <Link
              to="/login"
              className="flex-1 rounded-full bg-charcoal px-5 py-3 text-center text-[11px] uppercase tracking-[0.32em] text-ivory"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="flex-1 rounded-full px-5 py-3 text-center text-[11px] uppercase tracking-[0.32em] text-stone transition hover:text-charcoal"
            >
              Register
            </Link>
          </div>

          <div className="mb-8">
            <p className="tracking-label text-stone">Welcome Back</p>
            <h2 className="mt-3 font-serif-display text-4xl font-light tracking-wide text-charcoal md:text-5xl">
              Your account
            </h2>
            <p className="mt-3 text-sm leading-7 text-stone">
              Minimal feel. Real authentication. No admin-only nonsense.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                className="w-full bg-transparent text-sm text-charcoal outline-none placeholder:text-stone/50"
              />
            </div>

            <div className="flex items-center justify-between gap-4 text-[11px] uppercase tracking-[0.24em] text-stone">
              <span>Protected sign in</span>
              <Link
                to="/forgot-password"
                className="transition hover:text-charcoal"
              >
                Forgot password?
              </Link>
            </div>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50/70 px-4 py-3 text-sm text-red-500">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!formReady || submitting}
              className="group relative w-full overflow-hidden rounded-full border border-charcoal bg-charcoal px-6 py-4 text-[11px] uppercase tracking-[0.34em] text-ivory transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(26,26,24,0.14)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="relative z-10">
                {submitting ? 'Signing In...' : 'Enter Store'}
              </span>
            </button>
          </form>

          <div className="mt-8 rounded-[1.5rem] border border-charcoal/8 bg-white/55 p-5">
            <p className="text-[11px] uppercase tracking-[0.28em] text-stone">New here?</p>
            <p className="mt-2 text-sm leading-7 text-charcoal/75">
              Create an account for faster checkout, better continuity, and a cleaner shopping experience.
            </p>
            <Link
              to="/register"
              className="mt-4 inline-flex items-center text-[11px] uppercase tracking-[0.28em] text-charcoal underline-link"
            >
              Create account
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;