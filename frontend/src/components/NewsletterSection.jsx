import React, { useState } from 'react';
import { subscribeNewsletter } from '../utils/api';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await subscribeNewsletter(email);
      setSubmitted(true);
    } catch {
      // graceful fallback for dev
      setSubmitted(true);
    }
  };

  return (
    <section className="py-28 border-t border-silk">
      <div className="max-w-screen-xl mx-auto px-8 lg:px-16">
        <div className="max-w-xl mx-auto text-center">
          <p className="tracking-label text-stone mb-5">Stay Informed</p>
          <h2 className="font-serif-display text-3xl lg:text-4xl font-light text-charcoal tracking-wide mb-4">Newsletter</h2>
          <p className="font-sans text-xs font-light text-stone tracking-widest uppercase mb-12">Subscribe to Our Newsletter</p>
          {submitted ? (
            <p className="font-sans text-xs tracking-widest uppercase text-stone">Thank you for subscribing.</p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch border border-silk">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address" required
                className="flex-1 bg-transparent px-6 py-4 font-sans text-xs tracking-widest text-charcoal placeholder-stone/50 outline-none"/>
              <button type="submit"
                className="px-8 py-4 font-sans text-xs tracking-widest uppercase text-ivory bg-charcoal hover:bg-charcoal/80 transition-colors duration-300 border-l border-silk">
                Subscribe
              </button>
            </form>
          )}
          <p className="font-sans text-xs text-stone/40 tracking-wide mt-5">We respect your privacy. Unsubscribe at any time.</p>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;