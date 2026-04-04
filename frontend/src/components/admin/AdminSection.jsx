import React from 'react';

export const AdminShell = ({ title, description, action, children }) => (
  <section className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm lg:p-8">
    <div className="mb-6 flex flex-col gap-4 border-b border-silk pb-5 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="tracking-label text-stone">Admin</p>
        <h1 className="mt-3 font-serif-display text-4xl text-charcoal">{title}</h1>
        {description ? <p className="mt-3 max-w-2xl text-sm leading-7 text-stone">{description}</p> : null}
      </div>
      {action}
    </div>
    {children}
  </section>
);

export const StatCard = ({ label, value }) => (
  <div className="rounded-[1.5rem] border border-black/5 bg-ivory p-5">
    <p className="text-xs uppercase tracking-[0.24em] text-stone">{label}</p>
    <p className="mt-3 font-serif-display text-4xl text-charcoal">{value}</p>
  </div>
);
