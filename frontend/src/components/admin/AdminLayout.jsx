import React, { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';

const links = [
  ['Dashboard', '/admin/dashboard'],
  ['Products', '/admin/products'],
  ['Projects', '/admin/projects'],
  ['Archives', '/admin/archives'],
  ['Enquiries', '/admin/enquiries'],
  ['Newsletter', '/admin/newsletter'],
  ['Users', '/admin/users'],
  ['Settings', '/admin/settings'],
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const { admin, logoutAdmin } = useAdmin();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logoutAdmin();
    navigate('/admin/login', { replace: true });
  };

  const closeSidebar = () => setIsSidebarOpen(false);
  const openSidebar = () => setIsSidebarOpen(true);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isSidebarOpen]);

  return (
    <div className="min-h-screen bg-[#f7f3ed] pt-5">
      <div className="mx-auto max-w-screen-2xl px-6 pb-10 lg:px-8">
        <div className="mb-6 flex items-center justify-between lg:hidden">
          <div>
            <Link to="/" className="font-serif-display text-2xl text-charcoal">
              Shree Bhagvati Furniture
            </Link>
            <p className="mt-2 text-xs uppercase tracking-[0.28em] text-stone">
              Admin panel
            </p>
          </div>
          <button
            type="button"
            onClick={openSidebar}
            aria-label="Open sidebar"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-white shadow-sm transition hover:bg-cream"
          >
            <div className="space-y-1.5">
              <span className="block h-0.5 w-5 bg-charcoal"></span>
              <span className="block h-0.5 w-5 bg-charcoal"></span>
              <span className="block h-0.5 w-5 bg-charcoal"></span>
            </div>
          </button>
        </div>
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="hidden rounded-[2rem] border border-black/5 bg-white p-5 shadow-sm lg:block">
            <Link to="/" className="font-serif-display text-2xl text-charcoal">
              Shree Bhagvati Furniture
            </Link>
            <p className="mt-2 text-xs uppercase tracking-[0.28em] text-stone">
              Admin panel
            </p>
            <div className="mt-6 space-y-2">
              {links.map(([label, href]) => (
                <NavLink
                  key={href}
                  to={href}
                  className={({ isActive }) =>
                    `block rounded-2xl px-4 py-3 text-sm transition ${isActive
                      ? 'bg-charcoal text-ivory'
                      : 'text-charcoal hover:bg-cream'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </div>
            <div className="mt-8 rounded-2xl bg-cream p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-stone">
                Logged in as
              </p>
              <p className="mt-2 font-medium text-charcoal">
                {admin?.name || 'Admin'}
              </p>
              <p className="text-sm text-stone break-all">{admin?.email}</p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="mt-6 w-full rounded-full border border-charcoal px-4 py-3 text-xs uppercase tracking-[0.28em] text-charcoal transition hover:bg-charcoal hover:text-ivory"
            >
              Logout
            </button>
          </aside>

          {/* Mobile Sidebar Overlay */}
          <div
            className={`fixed inset-0 z-40 bg-black/40 transition-all duration-300 lg:hidden ${isSidebarOpen
              ? 'pointer-events-auto opacity-100'
              : 'pointer-events-none opacity-0'
              }`}
            onClick={closeSidebar}
          />

          {/* Mobile Sidebar */}
          <aside
            className={`fixed left-0 top-0 z-50 h-screen w-[290px] overflow-y-auto bg-white p-5 shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
              }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium text-charcoal">
                  {admin?.name || 'Admin'}
                </p>
                <p className="text-sm text-stone break-all">{admin?.email}</p>
              </div>
              <button
                type="button"
                onClick={closeSidebar}
                aria-label="Close sidebar"
                className="flex h-5 w-5 items-center justify-center text-xl text-charcoal"
              >
                ×
              </button>
            </div>
            <div className="mt-6 space-y-2">
              {links.map(([label, href]) => (
                <NavLink
                  key={href}
                  to={href}
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `block rounded-2xl px-4 py-3 text-sm transition ${isActive
                      ? 'bg-charcoal text-ivory'
                      : 'text-charcoal hover:bg-cream'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </div>

            {/* <div className="mt-8 rounded-2xl bg-cream p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-stone">
                Logged in as
              </p>
              <p className="mt-2 font-medium text-charcoal">
                {admin?.name || 'Admin'}
              </p>
              <p className="text-sm text-stone">{admin?.email}</p>
            </div> */}

            <button
              type="button"
              onClick={handleLogout}
              className="mt-6 w-full rounded-full border border-charcoal px-4 py-3 text-xs uppercase tracking-[0.28em] text-charcoal transition hover:bg-charcoal hover:text-ivory"
            >
              Logout
            </button>
          </aside>

          {/* Main Content */}
          <div className="space-y-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;