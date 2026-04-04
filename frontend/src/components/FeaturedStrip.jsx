import React from 'react';
import { Link } from 'react-router-dom';

const features = [
  { img: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=900&q=80&auto=format&fit=crop', label: 'Collection', title: 'Dansoon Collection', link: 'Discover the Collection Story', href: '/products' },
  { img: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=900&q=80&auto=format&fit=crop', label: 'Spatial Scent', title: 'A Sensory Interior', link: 'Explore the Series', href: '/products' },
  { img: 'https://images.unsplash.com/photo-1493663284031-b7e3aaa4cab8?w=900&q=80&auto=format&fit=crop', label: 'Ceramic', title: 'Ceramic Cup Edition', link: 'View the Edition', href: '/products' },
];

const FeaturedStrip = () => (
  <section className="pt-28 pb-24 px-8 lg:px-16 max-w-screen-xl mx-auto">
    <div className="flex items-center justify-between mb-14 border-b border-silk pb-6">
      <p className="tracking-label text-stone">Featured</p>
      <Link to="/products" className="underline-link tracking-label text-stone hover:text-charcoal transition-colors duration-300">View All</Link>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
      {features.map((item, idx) => (
        <article key={idx} className="group">
          <div className="img-hover overflow-hidden mb-5" style={{ aspectRatio: '3/4' }}>
            <img src={item.img} alt={item.title} className="w-full h-full object-cover"/>
          </div>
          <p className="tracking-label text-stone mb-2">{item.label}</p>
          <h3 className="font-serif-display text-xl font-light text-charcoal mb-3 tracking-wide">{item.title}</h3>
          <Link to={item.href} className="underline-link font-sans text-xs tracking-widest uppercase text-stone hover:text-charcoal transition-colors duration-300">{item.link}</Link>
        </article>
      ))}
    </div>
  </section>
);

export default FeaturedStrip;