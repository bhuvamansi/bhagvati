import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useLockBodyScroll from '../hooks/useLockBodyScroll';
import { NAV_LINKS } from '../constants/navigation';
import { useAuth } from '../context/AuthContext';

const MobileMenu = ({ isOpen, onClose }) => {
  const [expanded, setExpanded] = useState(null);
  const { user, isAuthenticated, logout, authLoading } = useAuth();

  useLockBodyScroll(isOpen);

  const handleLogout = async () => {
    await logout();
    onClose();
    window.location.href = '/';
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-ivory flex flex-col transition-all duration-700 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="flex items-center justify-between px-8 py-6 border-b border-silk">
        <Link
          to="/"
          onClick={onClose}
          className="font-serif-display text-lg tracking-widest font-light text-charcoal"
        >
          SHREE BHAGVATI FURNITURE
        </Link>

        <button
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center text-charcoal"
          aria-label="Close"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <line x1="1" y1="1" x2="19" y2="19" stroke="currentColor" strokeWidth="1" />
            <line x1="19" y1="1" x2="1" y2="19" stroke="currentColor" strokeWidth="1" />
          </svg>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-8 py-10">
        <ul>
          {NAV_LINKS.map((item) => (
            <li key={item.label} className="border-b border-silk">
              <div
                className="flex items-center justify-between py-6 cursor-pointer"
                onClick={() => item.hasMega && setExpanded(expanded === item.label ? null : item.label)}
              >
                <Link
                  to={item.href}
                  onClick={!item.hasMega ? onClose : undefined}
                  className="font-serif-display text-3xl font-light tracking-wide text-charcoal hover:text-stone transition-colors duration-300"
                >
                  {item.label}
                </Link>

                {item.hasMega && (
                  <span
                    className="text-stone text-lg transition-transform duration-300"
                    style={{ transform: expanded === item.label ? 'rotate(45deg)' : 'rotate(0)' }}
                  >
                    +
                  </span>
                )}
              </div>

              {item.hasMega && expanded === item.label && (
                <div className="pb-6 pl-4">
                  {['Sofa', 'Tea Table', 'Lounge Chair', 'Dining Table', 'Bed', 'Storage'].map((sub) => (
                    <Link
                      key={sub}
                      to={`/products?category=${sub.toLowerCase().replace(' ', '-')}`}
                      onClick={onClose}
                      className="block py-2 font-sans text-xs tracking-widest uppercase text-stone hover:text-charcoal transition-colors duration-300"
                    >
                      {sub}
                    </Link>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>

        <div className="mt-12 space-y-4">
          {!authLoading && !isAuthenticated && (
            <>
              <Link
                to="/login"
                onClick={onClose}
                className="block font-sans text-xs tracking-widest uppercase text-stone hover:text-charcoal transition-colors duration-300"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={onClose}
                className="block font-sans text-xs tracking-widest uppercase text-stone hover:text-charcoal transition-colors duration-300"
              >
                Register
              </Link>
            </>
          )}

          {!authLoading && isAuthenticated && (
            <>
              <p className="block font-sans text-xs tracking-widest uppercase text-charcoal">
                Signed in as {user?.name || 'User'}
              </p>
              <button
                type="button"
                onClick={handleLogout}
                className="block font-sans text-xs tracking-widest uppercase text-stone hover:text-charcoal transition-colors duration-300"
              >
                Logout
              </button>
            </>
          )}

          <Link
            to="/cart"
            onClick={onClose}
            className="block font-sans text-xs tracking-widest uppercase text-stone hover:text-charcoal transition-colors duration-300"
          >
            Cart
          </Link>

          <div className="flex gap-6 pt-4">
            <span className="font-sans text-xs tracking-widest uppercase text-charcoal">EN</span>
            <span className="font-sans text-xs tracking-widest uppercase text-stone/50">KR</span>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default MobileMenu;