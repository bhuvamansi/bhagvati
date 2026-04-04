import React from 'react';
import { Link } from 'react-router-dom';

const projects = [
  { id: '001', name: 'BLUE BOTTLE SEOUL STUDIO', location: 'Seoul, KR', year: '2024', category: 'Hospitality', slug: 'blue-bottle-seoul' },
  { id: '002', name: 'UN VILLAGE RESIDENCE',     location: 'Seoul, KR', year: '2023', category: 'Residential', slug: 'un-village-residence' },
  { id: '003', name: 'EMBASSY RESIDENCE',        location: 'Seoul, KR', year: '2023', category: 'Residential', slug: 'embassy-residence' },
  { id: '004', name: 'PRIVATE HOME',             location: 'Tokyo, JP', year: '2022', category: 'Residential', slug: 'private-home-tokyo' },
  { id: '005', name: 'JAPAN HOSPITALITY PROJECT',location: 'Kyoto, JP', year: '2022', category: 'Hospitality', slug: 'japan-hospitality' },
];

const ProjectsSection = () => (
  <section className="py-28">
    <div className="max-w-screen-xl mx-auto px-8 lg:px-16">
      <div className="flex items-end justify-between mb-14">
        <div>
          <p className="tracking-label text-stone mb-5">Portfolio</p>
          <h2 className="font-serif-display text-4xl lg:text-5xl font-light text-charcoal tracking-wide">Projects</h2>
        </div>
        <Link to="/project" className="underline-link font-sans text-xs tracking-widest uppercase text-stone hover:text-charcoal transition-colors duration-300 hidden lg:block">Discover More</Link>
      </div>
      <div className="border-t border-silk">
        {projects.map((p, idx) => (
          <Link key={idx} to={`/project/${p.slug}`}
            className="group flex items-center justify-between py-7 border-b border-silk hover:bg-cream/60 transition-colors duration-300 px-2">
            <div className="flex items-center gap-8 lg:gap-16">
              <span className="font-sans text-xs text-stone/50 w-8 shrink-0">{p.id}</span>
              <h3 className="font-serif-display text-xl lg:text-2xl font-light text-charcoal tracking-wide group-hover:text-stone transition-colors duration-300">{p.name}</h3>
            </div>
            <div className="hidden lg:flex items-center gap-12 shrink-0">
              <span className="font-sans text-xs tracking-widest uppercase text-stone">{p.category}</span>
              <span className="font-sans text-xs text-stone/50">{p.location}</span>
              <span className="font-sans text-xs text-stone/50">{p.year}</span>
              <span className="text-stone opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default ProjectsSection;