import React from 'react';
import { Link } from 'react-router-dom';
import { BRAND, FOOTER_COLUMNS } from '../constants/brand';

const Footer = () => (
  <footer className="bg-charcoal text-ivory">
    <div className="border-b border-ivory/10">
      <div className="max-w-screen-xl mx-auto px-8 lg:px-16 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <p className="tracking-label text-ivory/40 mb-6">Contact</p>
            <a href={`tel:${BRAND.phone}`} className="block font-serif-display text-2xl font-light text-ivory hover:text-ivory/60 transition-colors duration-300 mb-2">{BRAND.phone}</a>
            <a href={`mailto:${BRAND.email}`} className="underline-link font-sans text-xs tracking-widest uppercase text-ivory/50 hover:text-ivory/80 transition-colors duration-300">{BRAND.email}</a>
          </div>
          <div className="flex flex-col lg:items-end justify-between gap-6">
            <div className="flex items-center gap-6">
              {[
                { label: 'Instagram', href: BRAND.social.instagram, d: 'M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.975.975 1.246 2.242 1.308 3.608.058 1.266.069 1.646.069 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.975.975-2.242 1.246-3.608 1.308-1.266.058-1.646.069-4.85.069s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.975-.975-1.246-2.242-1.308-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.975-.975 2.242-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163M12 0C8.741 0 8.332.014 7.052.072 5.197.157 3.355.673 2.014 2.014.673 3.355.157 5.197.072 7.052.014 8.332 0 8.741 0 12c0 3.259.014 3.668.072 4.948.085 1.855.601 3.697 1.942 5.038 1.341 1.341 3.183 1.857 5.038 1.942C8.332 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 1.855-.085 3.697-.601 5.038-1.942 1.341-1.341 1.857-3.183 1.942-5.038C23.986 15.668 24 15.259 24 12c0-3.259-.014-3.668-.072-4.948-.085-1.855-.601-3.697-1.942-5.038C20.645.673 18.803.157 16.948.072 15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' },
              ].map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                  aria-label={s.label} className="text-ivory/50 hover:text-ivory transition-colors duration-300">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d={s.d}/></svg>
                </a>
              ))}
            </div>
            <p className="font-sans text-xs text-ivory/30 tracking-wide">{BRAND.locations.join(' · ')}</p>
          </div>
        </div>
      </div>
    </div>

    <div className="max-w-screen-xl mx-auto px-8 lg:px-16 py-16">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
        <div className="col-span-2 lg:col-span-1">
          <Link to="/" className="font-serif-display text-lg tracking-widest font-light text-ivory block mb-6">{BRAND.name}</Link>
          <p className="font-sans text-xs font-light text-ivory/40 leading-loose tracking-wide max-w-xs">{BRAND.tagline}</p>
        </div>
        {FOOTER_COLUMNS.map((col) => (
          <div key={col.heading}>
            <p className="tracking-label text-ivory/40 mb-7">{col.heading}</p>
            <ul className="space-y-3">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="font-sans text-xs text-ivory/50 hover:text-ivory/80 tracking-wide transition-colors duration-300 underline-link">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>

    <div className="border-t border-ivory/10">
      <div className="max-w-screen-xl mx-auto px-8 lg:px-16 py-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <p className="font-sans text-xs text-ivory/25 tracking-wide">© 2026 Shree Bhagvati Furniture · {BRAND.registration} · {BRAND.address}</p>
        <div className="flex gap-6">
          <span className="font-sans text-xs text-ivory/50 tracking-wide">EN</span>
          <span className="font-sans text-xs text-ivory/30 tracking-wide">IN</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;