import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MegaMenu from './MegaMenu';
import MobileMenu from './MobileMenu';
import useScrolled from '../hooks/useScrolled';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { NAV_LINKS } from '../constants/navigation';

const Header = () => {
  const scrolled = useScrolled(40);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems } = useCart();
  const { user, isAuthenticated, logout, authLoading } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-30 transition-all duration-500 ${
          scrolled ? 'bg-ivory/96 backdrop-blur-sm border-b border-silk py-4' : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-screen-xl mx-auto px-8 lg:px-12">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="font-serif-display text-base lg:text-lg tracking-widest font-light text-charcoal shrink-0"
            >
              SHREE BHAGVATI FURNITURE
            </Link>

            <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
              {NAV_LINKS.map((link) => (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => link.hasMega && setMegaOpen(true)}
                  onMouseLeave={() => link.hasMega && setMegaOpen(false)}
                >
                  <Link
                    to={link.href}
                    className="tracking-nav font-sans text-charcoal hover:text-stone transition-colors duration-300 underline-link"
                  >
                    {link.label}
                  </Link>
                </div>
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-6 shrink-0">
              {!authLoading && !isAuthenticated && (
                <>
                  <Link
                    to="/login"
                    className="tracking-nav font-sans text-charcoal hover:text-stone transition-colors duration-300"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="tracking-nav font-sans text-charcoal hover:text-stone transition-colors duration-300"
                  >
                    Register
                  </Link>
                </>
              )}

              {!authLoading && isAuthenticated && (
                <>
                  <span className="tracking-nav font-sans text-charcoal">
                    Hi, {user?.name?.split(' ')[0] || 'User'}
                  </span>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="tracking-nav font-sans text-charcoal hover:text-stone transition-colors duration-300"
                  >
                    Logout
                  </button>
                </>
              )}

              <Link to="/cart" className="relative group">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-charcoal group-hover:text-stone transition-colors duration-300"
                >
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 font-sans text-xs text-charcoal">
                    {totalItems}
                  </span>
                )}
              </Link>

              <button
                className="text-charcoal hover:text-stone transition-colors duration-300"
                aria-label="Language"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                </svg>
              </button>
            </div>

            <button
              className="lg:hidden flex flex-col gap-1.5 p-1"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <span className="block w-6 h-px bg-charcoal" />
              <span className="block w-4 h-px bg-charcoal" />
              <span className="block w-6 h-px bg-charcoal" />
            </button>
          </div>
        </div>

        <div onMouseEnter={() => setMegaOpen(true)} onMouseLeave={() => setMegaOpen(false)}>
          <MegaMenu isOpen={megaOpen} />
        </div>
      </header>

      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
};

export default Header;