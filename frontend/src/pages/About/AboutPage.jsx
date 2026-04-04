import React from 'react';

const AboutPage = () => (
  <div className="pt-32 pb-24">
    <div className="mx-auto max-w-screen-xl px-8 lg:px-16">
      <p className="tracking-label text-stone">About</p>
      <h1 className="mt-4 font-serif-display text-6xl text-charcoal">Shree Bhagvati Furniture</h1>
      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-[2rem] bg-cream p-8">
          <p className="text-sm leading-8 text-stone">This website is rebuilt from the Eastern Edition style and SRS structure, but the brand identity, pricing context, and business presentation are adapted for Shree Bhagvati Furniture. The focus is on premium furniture collections, bespoke enquiries, portfolio storytelling, customer authentication, and admin-managed content.</p>
        </div>
        <div className="overflow-hidden rounded-[2rem]"><img src="https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&q=80&auto=format&fit=crop" alt="Furniture workshop" className="h-full w-full object-cover" /></div>
      </div>
    </div>
  </div>
);

export default AboutPage;
