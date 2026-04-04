import React from 'react';
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

  const handleLogout = async () => {
    await logoutAdmin();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#f7f3ed] pt-24">
      <div className="mx-auto grid max-w-screen-2xl gap-6 px-6 pb-10 lg:grid-cols-[260px_1fr] lg:px-8">
        <aside className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm">
          <Link to="/" className="font-serif-display text-2xl text-charcoal">Shree Bhagvati Furniture</Link>
          <p className="mt-2 text-xs uppercase tracking-[0.28em] text-stone">Admin panel</p>
          <div className="mt-8 space-y-2">
            {links.map(([label, href]) => (
              <NavLink
                key={href}
                to={href}
                className={({ isActive }) =>
                  `block rounded-2xl px-4 py-3 text-sm transition ${
                    isActive ? 'bg-charcoal text-ivory' : 'text-charcoal hover:bg-cream'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          <div className="mt-8 rounded-2xl bg-cream p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-stone">Logged in as</p>
            <p className="mt-2 font-medium text-charcoal">{admin?.name || 'Admin'}</p>
            <p className="text-sm text-stone">{admin?.email}</p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-6 w-full rounded-full border border-charcoal px-4 py-3 text-xs uppercase tracking-[0.28em] text-charcoal transition hover:bg-charcoal hover:text-ivory"
          >
            Logout
          </button>
        </aside>

        <div className="space-y-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
