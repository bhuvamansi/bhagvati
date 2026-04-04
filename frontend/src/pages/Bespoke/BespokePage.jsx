import React, { useState } from 'react';
import { submitBespokeInquiry } from '../../utils/api';

const BespokePage = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: 'Bespoke furniture enquiry', message: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitBespokeInquiry(form);
      setMessage('Your bespoke enquiry has been submitted successfully.');
      setError('');
      setForm({ name: '', email: '', phone: '', subject: 'Bespoke furniture enquiry', message: '' });
    } catch (err) {
      setError(err.message);
      setMessage('');
    }
  };

  return (
    <div className="pt-32 pb-24">
      <div className="mx-auto grid max-w-screen-xl gap-10 px-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-16">
        <div>
          <p className="tracking-label text-stone">Bespoke</p>
          <h1 className="mt-4 font-serif-display text-6xl text-charcoal">Custom furniture enquiries</h1>
          <p className="mt-6 text-sm leading-8 text-stone">Consultation → Design → Approval → Production → Delivery. Use this page to request custom dimensions, materials, room-specific solutions, or full residential furnishing assistance.</p>
        </div>
        <form onSubmit={onSubmit} className="grid gap-4 rounded-[2rem] border border-black/5 bg-white p-8 shadow-sm">
          <input className="rounded-2xl border border-silk bg-ivory px-4 py-3" placeholder="Full name" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} required />
          <input className="rounded-2xl border border-silk bg-ivory px-4 py-3" placeholder="Email" type="email" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} required />
          <input className="rounded-2xl border border-silk bg-ivory px-4 py-3" placeholder="Phone" value={form.phone} onChange={(e)=>setForm({...form,phone:e.target.value})} />
          <textarea className="min-h-36 rounded-2xl border border-silk bg-ivory px-4 py-3" placeholder="Tell us about your space, dimensions, materials, and budget" value={form.message} onChange={(e)=>setForm({...form,message:e.target.value})} required />
          {message ? <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div> : null}
          {error ? <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div> : null}
          <button className="rounded-full bg-charcoal px-6 py-4 text-xs uppercase tracking-[0.28em] text-ivory">Submit enquiry</button>
        </form>
      </div>
    </div>
  );
};

export default BespokePage;
