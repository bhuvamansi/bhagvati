import React from 'react';
import { Link } from 'react-router-dom';

const PhilosophySection = () => (
  <section className="py-28 bg-charcoal">
    <div className="max-w-screen-xl mx-auto px-8 lg:px-24">
      <div className="max-w-4xl mx-auto text-center">
        <p className="tracking-label text-ivory/40 mb-12">Philosophy</p>
        <blockquote className="font-serif-display text-2xl lg:text-4xl xl:text-5xl font-light text-ivory leading-relaxed tracking-wide mb-14">
          We design from the quiet intersection of heritage and the present —
          where craftsmanship becomes form, and material honesty becomes language.
        </blockquote>
        <p className="font-sans text-xs font-light text-ivory/50 leading-loose tracking-widest max-w-xl mx-auto mb-14">
          Our work is grounded in a sensitivity to culture, space, and the lived experience of objects.
          We believe that furniture, at its most meaningful, is both architecture and memory —
          a quiet testament to thoughtful making.
        </p>
        <Link to="/about" className="underline-link font-sans text-xs tracking-widest uppercase text-ivory/70 hover:text-ivory transition-colors duration-300">
          Learn More
        </Link>
      </div>
    </div>
  </section>
);

export default PhilosophySection;