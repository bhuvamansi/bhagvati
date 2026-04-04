import React from 'react';
import { Link } from 'react-router-dom';

const collections = [
  { label: 'Table', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=700&q=80&auto=format&fit=crop', href: '/products?category=dining-table' },
  { label: 'Chair', img: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=700&q=80&auto=format&fit=crop', href: '/products?category=lounge-chair' },
  { label: 'Sofa',  img: 'https://images.unsplash.com/photo-1493663284031-b7e3aaa4cab8?w=700&q=80&auto=format&fit=crop', href: '/products?category=sofa' },
  { label: 'Bed',   img: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=700&q=80&auto=format&fit=crop', href: '/products?category=bed' },
];

const CollectionsSection = () => (
  <section className="py-28 bg-cream">
    <div className="max-w-screen-xl mx-auto px-8 lg:px-16">
      <div className="mb-6">
        <p className="tracking-label text-stone mb-5">Our Collections</p>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <h2 className="font-serif-display text-4xl lg:text-5xl font-light text-charcoal tracking-wide">Shop Our Collections</h2>
          <p className="font-sans text-xs font-light text-stone leading-relaxed max-w-sm tracking-wide">
            The importance of heritage, locality, and sustainability is the grounding vision. Each piece is crafted with material honesty — a timeless form for thoughtful living.
          </p>
        </div>
      </div>
      <div className="border-t border-silk mb-16"/>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {collections.map((item, idx) => (
          <Link key={idx} to={item.href} className="group block">
            <div className="img-hover overflow-hidden mb-4" style={{ aspectRatio: '2/3' }}>
              <img src={item.img} alt={item.label} className="w-full h-full object-cover"/>
            </div>
            <p className="font-sans text-xs tracking-widest uppercase text-charcoal group-hover:text-stone transition-colors duration-300">{item.label}</p>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default CollectionsSection;