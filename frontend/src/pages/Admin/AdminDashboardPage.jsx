import React, { useEffect, useState } from 'react';
import { getAdminAnalytics } from '../../utils/api';
import { AdminShell, StatCard } from '../../components/admin/AdminSection';
import { shortDate, titleCase } from '../../utils/format';

const AdminDashboardPage = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getAdminAnalytics()
      .then((response) => setData(response?.data || null))
      .catch((err) => setError(err.message));
  }, []);

  const stats = data?.stats || {};
  const enquiries = data?.recentEnquiries || [];

  return (
    <AdminShell title="Dashboard" description="Overview of products, projects, enquiries, subscribers, and user growth.">
      {error ? <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div> : null}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Products" value={stats.totalProducts || 0} />
        <StatCard label="Projects" value={stats.totalProjects || 0} />
        <StatCard label="Enquiries" value={stats.totalEnquiries || 0} />
        <StatCard label="Subscribers" value={stats.activeSubscribers || 0} />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[1.5rem] border border-black/5 p-5">
          <h2 className="font-serif-display text-3xl text-charcoal">Recent Enquiries</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-stone"><tr><th className="py-3">Name</th><th>Email</th><th>Type</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {enquiries.map((item) => (
                  <tr key={item._id} className="border-t border-silk">
                    <td className="py-3 font-medium text-charcoal">{item.name}</td>
                    <td>{item.email}</td>
                    <td>{titleCase(item.type)}</td>
                    <td>{titleCase(item.status)}</td>
                    <td>{shortDate(item.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="rounded-[1.5rem] border border-black/5 bg-ivory p-5">
          <h2 className="font-serif-display text-3xl text-charcoal">Quick Summary</h2>
          <div className="mt-4 space-y-3 text-sm text-stone">
            <p>Published products: <strong className="text-charcoal">{stats.publishedProducts || 0}</strong></p>
            <p>Featured products: <strong className="text-charcoal">{stats.featuredProducts || 0}</strong></p>
            <p>Featured projects: <strong className="text-charcoal">{stats.featuredProjects || 0}</strong></p>
            <p>New enquiries: <strong className="text-charcoal">{stats.newEnquiries || 0}</strong></p>
            <p>Total users: <strong className="text-charcoal">{stats.totalUsers || 0}</strong></p>
            <p>Total admins: <strong className="text-charcoal">{stats.totalAdmins || 0}</strong></p>
          </div>
        </div>
      </div>
    </AdminShell>
  );
};

export default AdminDashboardPage;
