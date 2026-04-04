import React from 'react';
import { Link } from 'react-router-dom';
import { MEGA_MENU } from '../constants/navigation';

const MegaMenu = ({ isOpen }) => (
  <div className={`absolute top-full left-0 w-full bg-ivory border-t border-silk z-40 transition-all duration-500 overflow-hidden ${
    isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
  }`} style={{ maxHeight: isOpen ? '520px' : '0' }}>
    <div className="max-w-screen-xl mx-auto px-12 py-14 grid grid-cols-3 gap-16">

      <div>
        <p className="tracking-label text-stone mb-7">By Category</p>
        <ul className="space-y-3">
          {MEGA_MENU.byCategory.map((item) => (
            <li key={item.label}>
              <Link to={item.href}
                className="font-sans text-xs tracking-widest uppercase text-charcoal hover:text-stone transition-colors duration-300 underline-link">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="tracking-label text-stone mb-7">By Space</p>
        <ul className="space-y-3">
          {MEGA_MENU.bySpace.map((item) => (
            <li key={item.label}>
              <Link to={item.href}
                className="font-sans text-xs tracking-widest uppercase text-charcoal hover:text-stone transition-colors duration-300 underline-link">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-12">
          <p className="tracking-label text-stone mb-7">Special</p>
          <ul className="space-y-3">
            {MEGA_MENU.special.map((item) => (
              <li key={item.label}>
                <Link to={item.href}
                  className="font-sans text-xs tracking-widest uppercase text-charcoal hover:text-stone transition-colors duration-300 underline-link">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="img-hover overflow-hidden" style={{ height: '200px' }}>
          <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80&auto=format&fit=crop"
            alt="Bespoke" className="w-full h-full object-cover"/>
        </div>
        <p className="tracking-label text-stone">Bespoke Solution</p>
      </div>
    </div>
  </div>
);

export default MegaMenu;