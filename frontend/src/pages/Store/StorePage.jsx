import React from 'react';

const StorePage = () => (
  <div className="pt-32 pb-24">
    <div className="mx-auto max-w-screen-xl px-8 lg:px-16">
      <p className="tracking-label text-stone">Store</p>
      <h1 className="mt-4 font-serif-display text-6xl text-charcoal">Visit our showroom</h1>
      <div className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] bg-cream p-8 text-sm leading-8 text-stone">
          <p><strong className="text-charcoal">Address:</strong> Ahmedabad, Gujarat, India</p>
          <p><strong className="text-charcoal">Phone:</strong> +91 98765 43210</p>
          <p><strong className="text-charcoal">Hours:</strong> Mon - Sat | 10:00 AM - 8:00 PM</p>
          <p className="mt-4">You can use this page for showroom details or replace it with your exact Google Maps iframe and official address later.</p>
        </div>
        <iframe title="Store location" className="min-h-[420px] w-full rounded-[2rem] border-0" src="https://maps.google.com/maps?q=Ahmedabad&t=&z=11&ie=UTF8&iwloc=&output=embed" />
      </div>
    </div>
  </div>
);

export default StorePage;
