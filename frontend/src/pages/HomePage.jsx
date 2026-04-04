import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, getProjects, getSiteSettings } from '../utils/api';
import { formatCurrency } from '../utils/format';

const HomePage = () => {
  const [settings, setSettings] = useState(null);
  const [products, setProducts] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    getSiteSettings().then((res) => setSettings(res?.data?.settings || null)).catch(() => {});
    getProducts({ featured: true, limit: 4 }).then((res) => setProducts(res?.data?.products || [])).catch(() => {});
    getProjects({ featured: true, limit: 4 }).then((res) => setProjects(res?.data?.projects || [])).catch(() => {});
  }, []);

  return (
    <div className="pt-24">
      <section className="relative isolate overflow-hidden bg-charcoal text-ivory">
        <img src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1600&q=80&auto=format&fit=crop" alt="Luxury furniture interior" className="absolute inset-0 h-full w-full object-cover opacity-35" />
        <div className="relative mx-auto max-w-screen-xl px-8 py-28 lg:px-16 lg:py-36">
          <p className="tracking-label text-ivory/60">Premium furniture studio</p>
          <h1 className="mt-6 max-w-4xl font-serif-display text-5xl leading-[0.95] md:text-7xl">{settings?.brandName || 'Shree Bhagvati Furniture'}</h1>
          <p className="mt-6 max-w-2xl text-sm leading-7 text-ivory/80">{settings?.brandTagline || 'Clone-ready MERN furniture website with admin CMS, JWT authentication, forgot-password flow, and Indian rupee pricing.'}</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link to="/products" className="rounded-full bg-ivory px-6 py-4 text-xs uppercase tracking-[0.28em] text-charcoal">Shop collections</Link>
            <Link to="/bespoke" className="rounded-full border border-ivory/60 px-6 py-4 text-xs uppercase tracking-[0.28em] text-ivory">Bespoke enquiry</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-screen-xl px-8 py-24 lg:px-16">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="tracking-label text-stone">Collections</p>
            <h2 className="mt-4 font-serif-display text-5xl text-charcoal">Featured Products</h2>
          </div>
          <Link to="/products" className="text-xs uppercase tracking-[0.28em] text-stone underline-link">View all</Link>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <Link key={product._id} to={`/products/${product.slug || product._id}`} className="group block">
              <div className="overflow-hidden rounded-[1.5rem] bg-cream" style={{ aspectRatio: '3/4' }}>
                <img src={product.coverImage || product.images?.[0]?.url} alt={product.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              </div>
              <div className="mt-4">
                <p className="text-xs uppercase tracking-[0.24em] text-stone">{product.category}</p>
                <h3 className="mt-2 font-serif-display text-2xl text-charcoal">{product.name}</h3>
                <p className="mt-2 text-sm text-stone">{formatCurrency(product.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-cream py-24">
        <div className="mx-auto max-w-screen-xl px-8 lg:px-16">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="tracking-label text-stone">Portfolio</p>
              <h2 className="mt-4 font-serif-display text-5xl text-charcoal">Projects</h2>
            </div>
            <Link to="/project" className="text-xs uppercase tracking-[0.28em] text-stone underline-link">Discover more</Link>
          </div>
          <div className="mt-10 grid gap-4">
            {projects.map((project) => (
              <Link key={project._id} to={`/project/${project.slug || project._id}`} className="rounded-[1.5rem] border border-black/5 bg-white p-5 transition hover:-translate-y-1 hover:shadow-sm">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-stone">{project.category}</p>
                    <h3 className="mt-2 font-serif-display text-3xl text-charcoal">{project.title}</h3>
                    <p className="mt-2 text-sm text-stone">{project.summary}</p>
                  </div>
                  <div className="text-sm text-stone">{project.location} • {project.year}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-screen-xl px-8 py-24 lg:px-16">
        <div className="grid gap-8 rounded-[2rem] bg-charcoal p-8 text-ivory lg:grid-cols-[1fr_0.8fr] lg:p-12">
          <div>
            <p className="tracking-label text-ivory/60">About the brand</p>
            <h2 className="mt-4 font-serif-display text-5xl">Made for Indian homes.</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-ivory/80">Inspired by the structure of the Eastern Edition reference and rebuilt for Shree Bhagvati Furniture, this project supports premium catalogue browsing, enquiry-led selling, user authentication, and admin-side content control.</p>
          </div>
          <div className="rounded-[1.5rem] bg-ivory/10 p-6 text-sm leading-7 text-ivory/80">
            <p>Included in this build:</p>
            <ul className="mt-3 space-y-2">
              <li>JWT user and admin authentication</li>
              <li>Forgot-password email link workflow</li>
              <li>Admin CRUD for products, projects, archives, enquiries, and settings</li>
              <li>Indian rupee pricing and brand rename across the site</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
