import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { loginAdmin } = useAdmin();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await loginAdmin(form);
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Unable to login.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-ivory px-6 pt-28">
      <div className="mx-auto max-w-xl rounded-[2rem] border border-black/5 bg-white p-8 shadow-sm">
        <p className="tracking-label text-stone">Shree Bhagvati Furniture</p>
        <h1 className="mt-4 font-serif-display text-5xl text-charcoal">Admin Login</h1>
        <p className="mt-3 text-sm leading-7 text-stone">Use the seeded superadmin account or your created admin account.</p>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <input className="w-full rounded-2xl border border-silk bg-ivory px-5 py-4 outline-none" placeholder="Admin email" type="email" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} required />
          <input className="w-full rounded-2xl border border-silk bg-ivory px-5 py-4 outline-none" placeholder="Password" type="password" value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})} required />
          {error ? <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div> : null}
          <button className="w-full rounded-full bg-charcoal px-6 py-4 text-xs uppercase tracking-[0.28em] text-ivory" disabled={submitting}>{submitting ? 'Signing in...' : 'Login to admin'}</button>
        </form>
        <div className="mt-6 rounded-2xl bg-cream p-4 text-sm text-stone">
          <div>Email: admin@shreebhagvatifurniture.com</div>
          <div>Password: Admin@1234</div>
        </div>
      </div>
    </section>
  );
};

export default AdminLoginPage;
