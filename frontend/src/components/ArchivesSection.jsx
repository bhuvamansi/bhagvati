import React from 'react';
import { Link } from 'react-router-dom';

const items = [
  { year: '2024', title: 'DANSOON — Milan Design Week',        category: 'Exhibition' },
  { year: '2024', title: 'Material Futures Research',          category: 'Research' },
  { year: '2023', title: 'The Standard, Seoul',                category: 'Press' },
  { year: '2023', title: 'Collaboration with Kim Seo-ryoung',  category: 'Collaboration' },
  { year: '2022', title: 'Ceramics & Spatial Scent',           category: 'Collection' },
];

const ArchivesSection = () => (
  <section className="py-28">
    <div className="max-w-screen-xl mx-auto px-8 lg:px-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
        <div className="img-hover overflow-hidden" style={{ aspectRatio: '4/5' }}>
          <img src="https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=900&q=80&auto=format&fit=crop"
            alt="Archives" className="w-full h-full object-cover"/>
        </div>
        <div className="flex flex-col justify-center lg:pt-16">
          <p className="tracking-label text-stone mb-6">Record</p>
          <h2 className="font-serif-display text-4xl lg:text-5xl font-light text-charcoal tracking-wide mb-6">Archives</h2>
          <p className="font-sans text-xs font-light text-stone leading-loose tracking-wide mb-12 max-w-sm">
            A curated record of exhibitions, press, collaborations, material research, and studio history — a living document of our practice.
          </p>
          <div className="border-t border-silk">
            {items.map((item, idx) => (
              <a key={idx} href="#"
                className="group flex items-start justify-between py-5 border-b border-silk hover:opacity-60 transition-opacity duration-300">
                <div>
                  <p className="font-serif-display text-base font-light text-charcoal tracking-wide group-hover:text-stone transition-colors duration-300">{item.title}</p>
                  <p className="font-sans text-xs text-stone/60 tracking-widest uppercase mt-1">{item.category}</p>
                </div>
                <span className="font-sans text-xs text-stone/40 shrink-0 ml-6 mt-1">{item.year}</span>
              </a>
            ))}
          </div>
          <div className="mt-10">
            <Link to="/about" className="underline-link font-sans text-xs tracking-widest uppercase text-stone hover:text-charcoal transition-colors duration-300">Learn More</Link>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default ArchivesSection;