import React, { useState, useEffect } from 'react';

const slides = [
  { img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1800&q=85&auto=format&fit=crop', label: 'New Collection', title: 'Dansoon', subtitle: 'Discover the Collection Story' },
  { img: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=1800&q=85&auto=format&fit=crop', label: 'Spatial Scent', title: 'A Sensory Study', subtitle: 'Explore the Spatial Scent Series' },
  { img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1800&q=85&auto=format&fit=crop', label: 'Atelier', title: 'The Studio', subtitle: 'Inside Our Atelier' },
];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrent((p) => (p + 1) % slides.length), 5500);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative w-full overflow-hidden" style={{ height: '100vh', minHeight: '600px' }}>
      {slides.map((slide, idx) => (
        <div key={idx} className={`absolute inset-0 transition-opacity duration-1000 ${idx === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
          <div className="img-hover absolute inset-0">
            <img src={slide.img} alt={slide.title} className="w-full h-full object-cover"/>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/35 via-transparent to-transparent"/>
          <div className="absolute bottom-16 left-8 lg:left-16 z-20">
            <p className="tracking-label text-ivory/70 mb-3">{slide.label}</p>
            <h1 className="font-serif-display text-5xl lg:text-7xl font-light text-ivory leading-none tracking-wide mb-6">{slide.title}</h1>
            <a href="#" className="underline-link font-sans text-xs tracking-widest uppercase text-ivory/90 hover:text-ivory transition-colors duration-300">{slide.subtitle}</a>
          </div>
        </div>
      ))}
      <div className="absolute bottom-16 right-8 lg:right-16 z-20 flex flex-col items-end gap-3">
        {slides.map((_, idx) => (
          <button key={idx} onClick={() => setCurrent(idx)}
            className={`block h-px transition-all duration-500 ${idx === current ? 'w-8 bg-ivory' : 'w-4 bg-ivory/40'}`}
            aria-label={`Slide ${idx + 1}`}/>
        ))}
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 opacity-40">
        <span className="tracking-label text-ivory">Scroll</span>
        <div className="w-px h-10 bg-ivory animate-pulse"/>
      </div>
    </section>
  );
};

export default HeroSection;