import React from 'react';
import { Link } from 'react-router-dom';

const BespokeSection = () => (
  <section className="py-28 bg-cream">
    <div className="max-w-screen-xl mx-auto px-8 lg:px-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        <div className="order-2 lg:order-1">
          <p className="tracking-label text-stone mb-6">Tailored</p>
          <h2 className="font-serif-display text-4xl lg:text-5xl xl:text-6xl font-light text-charcoal tracking-wide leading-tight mb-8">Bespoke</h2>
          <p className="font-sans text-xs font-light text-stone leading-loose tracking-wide mb-6 max-w-sm">
            We offer a private consultation and custom furniture design service for residences, galleries, hotels, restaurants, and offices.
          </p>
          <p className="font-sans text-xs font-light text-stone leading-loose tracking-wide mb-12 max-w-sm">
            Each commission begins with a conversation — a slow, attentive dialogue between space, client, and maker.
          </p>
          <Link to="/bespoke" className="underline-link font-sans text-xs tracking-widest uppercase text-charcoal hover:text-stone transition-colors duration-300">Learn More</Link>
        </div>
        <div className="order-1 lg:order-2 img-hover overflow-hidden" style={{ aspectRatio: '4/5' }}>
          <img src="https://images.unsplash.com/photo-1604578762246-41134e37f9cc?w=900&q=80&auto=format&fit=crop"
            alt="Bespoke" className="w-full h-full object-cover"/>
        </div>
      </div>
    </div>
  </section>
);

export default BespokeSection;