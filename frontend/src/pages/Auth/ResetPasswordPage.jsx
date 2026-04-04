import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { resetUserPassword } from '../../utils/api';
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

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const { refreshUser } = useAuth();

  const [form, setForm] = useState({
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

  const canSubmit = !!token && form.password && form.confirmPassword && !passwordError;

  const handleChange = (e) => {
    setError('');
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setError('');

    try {
      await resetUserPassword(token, {
        password: form.password,
        confirmPassword: form.confirmPassword,
      });

      await refreshUser();
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Reset token is invalid or has expired.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-ivory px-6 pb-16 pt-32 md:px-10 lg:px-14">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-[10%] top-28 h-44 w-44 rounded-full bg-silk/70 blur-3xl" />
        <div className="absolute left-[10%] top-44 h-56 w-56 rounded-full bg-stone/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-3xl rounded-[2rem] border border-silk/80 bg-white/45 p-5 shadow-[0_20px_80px_rgba(26,26,24,0.08)] backdrop-blur-xl sm:p-7 md:p-8 lg:p-10">
        <div className="mb-8">
          <p className="tracking-label text-stone">New Password</p>
          <h1 className="mt-3 font-serif-display text-4xl font-light tracking-wide text-charcoal md:text-5xl">
            Set a fresh password
          </h1>
          <p className="mt-3 text-sm leading-7 text-stone">
            Keep it strong, clean, and secure.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="rounded-[1.5rem] border border-charcoal/8 bg-ivory/80 px-5 py-4">
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-[11px] uppercase tracking-[0.28em] text-stone">
                New Password
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
              placeholder="Enter new password"
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
              placeholder="Repeat new password"
              autoComplete="new-password"
              required
              className="w-full bg-transparent text-sm text-charcoal outline-none placeholder:text-stone/50"
            />
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
            disabled={!canSubmit || submitting}
            className="w-full rounded-full border border-charcoal bg-charcoal px-6 py-4 text-[11px] uppercase tracking-[0.34em] text-ivory transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(26,26,24,0.14)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Updating Password...' : 'Reset Password'}
          </button>
        </form>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-[1.5rem] border border-charcoal/8 bg-white/55 p-5">
          <p className="text-sm text-charcoal/75">Want to go back instead?</p>
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

export default ResetPasswordPage;