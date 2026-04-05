import React, { useEffect, useMemo, useState } from 'react';
import {
  createArchive, createProduct, createProject, deleteArchive, deleteProduct, deleteProject,
  getArchives, getContacts, getProducts, getProjects, getSiteSettings, getSubscribers, getAdminUsers,
  updateArchive, updateContactStatus, updateProduct, updateProject, updateSiteSettings, updateAdminUser,
} from '../../utils/api';
import { AdminShell } from '../../components/admin/AdminSection';
import { formatCurrency, shortDate, titleCase } from '../../utils/format';

const baseProduct = {
  name: '', shortDescription: '', description: '', price: '', category: 'sofa', material: 'fabric', roomCategory: 'living',
  images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80&auto=format&fit=crop'], featured: false, inStock: true, status: 'published',
};
const baseProject = {
  title: '', summary: '', description: '', category: 'residential', location: '', year: new Date().getFullYear(),
  coverImage: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80&auto=format&fit=crop', images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80&auto=format&fit=crop'], featured: false, status: 'published',
};
const baseArchive = {
  title: '', excerpt: '', content: '', type: 'press', coverImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&q=80&auto=format&fit=crop', status: 'published', featured: false,
};

const useCrud = (fetcher) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const response = await fetcher();
      const key = Object.keys(response?.data || {})[0];
      setItems(response?.data?.[key] || []);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);
  return { items, setItems, loading, error, reload: load };
};

const PanelForm = ({ fields, form, setForm, onSubmit, submitLabel, editing }) => (
  <form className="grid gap-3 md:grid-cols-2" onSubmit={onSubmit}>
    {fields.map((field) => (
      <div key={field.name} className={field.full ? 'md:col-span-2' : ''}>
        <label className="mb-1 block text-xs uppercase tracking-[0.24em] text-stone">{field.label}</label>
        {field.type === 'textarea' ? (
          <textarea className="min-h-28 w-full rounded-2xl border border-silk bg-ivory px-4 py-3 outline-none" value={form[field.name] ?? ''} onChange={(e) => setForm({ ...form, [field.name]: e.target.value })} />
        ) : field.type === 'checkbox' ? (
          <label className="flex items-center gap-3 rounded-2xl border border-silk bg-ivory px-4 py-4"><input type="checkbox" checked={!!form[field.name]} onChange={(e) => setForm({ ...form, [field.name]: e.target.checked })} /> <span>{field.help || field.label}</span></label>
        ) : (
          <input className="w-full rounded-2xl border border-silk bg-ivory px-4 py-3 outline-none" type={field.type || 'text'} value={form[field.name] ?? ''} onChange={(e) => setForm({ ...form, [field.name]: e.target.value })} />
        )}
      </div>
    ))}
    <div className="md:col-span-2 flex gap-3">
      <button className="rounded-full bg-charcoal px-5 py-3 text-xs uppercase tracking-[0.24em] text-ivory">{editing ? `Update ${submitLabel}` : `Create ${submitLabel}`}</button>
    </div>
  </form>
);

// export const AdminArchivesPage = () => {
//   const { items, error, reload } = useCrud(() => getArchives({ limit: 100 }));
//   const [form, setForm] = useState(baseArchive); const [editingId, setEditingId] = useState('');
//   const fields = [{ name: 'title', label: 'Title' }, { name: 'type', label: 'Type' }, { name: 'excerpt', label: 'Excerpt', full: true }, { name: 'content', label: 'Content', type: 'textarea', full: true }, { name: 'featured', label: 'Featured', type: 'checkbox' }];
//   const submit = async (e) => { e.preventDefault(); const payload = { ...form }; editingId ? await updateArchive(editingId, payload) : await createArchive(payload); setForm(baseArchive); setEditingId(''); reload(); };
//   return <AdminShell title="Archives" description="Manage press, exhibition, and collaboration content."><div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]"><div className="overflow-x-auto rounded-[1.5rem] border border-black/5 p-5"><table className="min-w-full text-sm"><thead><tr className="text-stone"><th className="py-3 text-left">Title</th><th>Type</th><th>Status</th><th></th></tr></thead><tbody>{items.map((item) => <tr key={item._id} className="border-t border-silk"><td className="py-3"><div className="font-medium text-charcoal">{item.title}</div><div className="text-stone">{item.excerpt}</div></td><td>{titleCase(item.type)}</td><td>{titleCase(item.status)}</td><td className="space-x-2"><button className="text-stone" onClick={() => { setEditingId(item._id); setForm(item); }}>Edit</button><button className="text-red-600" onClick={async () => { await deleteArchive(item._id); reload(); }}>Delete</button></td></tr>)}</tbody></table>{error ? <div className="mt-4 text-red-600">{error}</div> : null}</div><div className="rounded-[1.5rem] border border-black/5 p-5"><h2 className="font-serif-display text-3xl text-charcoal">{editingId ? 'Edit Archive' : 'Create Archive'}</h2><div className="mt-4"><PanelForm fields={fields} form={form} setForm={setForm} onSubmit={submit} submitLabel="archive" editing={!!editingId} /></div></div></div></AdminShell>;
// };

export const AdminEnquiriesPage = () => {
  const { items, error, reload } = useCrud(() => getContacts({ limit: 100 }));
  return <AdminShell title="Enquiries" description="Track contact and bespoke leads."><div className="overflow-x-auto rounded-[1.5rem] border border-black/5 p-5"><table className="min-w-full text-sm"><thead><tr className="text-stone"><th className="py-3 text-left">Customer</th><th>Type</th><th>Status</th><th>Received</th><th>Action</th></tr></thead><tbody>{items.map((item) => <tr key={item._id} className="border-t border-silk"><td className="py-3"><div className="font-medium text-charcoal">{item.name}</div><div className="text-stone">{item.email}</div><div className="text-stone">{item.message?.slice(0, 90)}</div></td><td>{titleCase(item.type)}</td><td>{titleCase(item.status)}</td><td>{shortDate(item.createdAt)}</td><td><select className="rounded-xl border border-silk bg-ivory px-3 py-2" value={item.status} onChange={async (e) => { await updateContactStatus(item._id, { status: e.target.value }); reload(); }}><option value="new">New</option><option value="read">Read</option><option value="replied">Replied</option><option value="closed">Closed</option></select></td></tr>)}</tbody></table>{error ? <div className="mt-4 text-red-600">{error}</div> : null}</div></AdminShell>;
};

export const AdminNewsletterPage = () => {
  const { items, error } = useCrud(() => getSubscribers());
  return <AdminShell title="Newsletter" description="View newsletter subscribers and subscription status."><div className="overflow-x-auto rounded-[1.5rem] border border-black/5 p-5"><table className="min-w-full text-sm"><thead><tr className="text-stone"><th className="py-3 text-left">Email</th><th>Consent</th><th>Status</th><th>Joined</th></tr></thead><tbody>{items.map((item) => <tr key={item._id} className="border-t border-silk"><td className="py-3 font-medium text-charcoal">{item.email}</td><td>{item.consent ? 'Yes' : 'No'}</td><td>{item.active ? 'Active' : 'Inactive'}</td><td>{shortDate(item.createdAt)}</td></tr>)}</tbody></table>{error ? <div className="mt-4 text-red-600">{error}</div> : null}</div></AdminShell>;
};

export const AdminUsersPage = () => {
  const { items, error, reload } = useCrud(() => getAdminUsers({ limit: 100 }));
  return <AdminShell title="Users" description="Activate or deactivate customer accounts."><div className="overflow-x-auto rounded-[1.5rem] border border-black/5 p-5"><table className="min-w-full text-sm"><thead><tr className="text-stone"><th className="py-3 text-left">User</th><th>Status</th><th>Joined</th><th className='text-center'>Action</th></tr></thead><tbody>{items.map((item) => <tr key={item._id} className="border-t border-silk"><td className="py-3"><div className="font-medium text-charcoal">{item.name}</div><div className="text-stone">{item.email}</div></td><td className='text-center'>{item.isActive ? 'Active' : 'Inactive'}</td><td className='text-center'>{shortDate(item.createdAt)}</td><td className='text-center'><button className="rounded-full border border-charcoal px-4 py-2 text-xs uppercase tracking-[0.24em]" onClick={async () => { await updateAdminUser(item._id, { isActive: !item.isActive }); reload(); }}>{item.isActive ? 'Deactivate' : 'Activate'}</button></td></tr>)}</tbody></table>{error ? <div className="mt-4 text-red-600">{error}</div> : null}</div></AdminShell>;
};

export const AdminSettingsPage = () => {
  const [form, setForm] = useState(null); const [message, setMessage] = useState(''); const [error, setError] = useState('');
  useEffect(() => { getSiteSettings().then((response) => setForm(response?.data?.settings || {})).catch((err) => setError(err.message)); }, []);
  const canRender = useMemo(() => !!form, [form]);
  const submit = async (e) => { e.preventDefault(); try { await updateSiteSettings(form); setMessage('Settings saved successfully.'); setError(''); } catch (err) { setError(err.message); setMessage(''); } };
  if (!canRender) return <AdminShell title="Settings" description="Update contact and brand information."><div>Loading settings...</div></AdminShell>;
  return <AdminShell title="Settings" description="Update brand contact details and public-facing site settings."><form className="grid gap-4 md:grid-cols-2" onSubmit={submit}><input className="rounded-2xl border border-silk bg-ivory px-4 py-3" value={form.brandName || ''} onChange={(e) => setForm({ ...form, brandName: e.target.value })} placeholder="Brand name" /><input className="rounded-2xl border border-silk bg-ivory px-4 py-3" value={form.contactPhone || ''} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} placeholder="Phone" /><input className="rounded-2xl border border-silk bg-ivory px-4 py-3" value={form.contactEmail || ''} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} placeholder="Email" /><input className="rounded-2xl border border-silk bg-ivory px-4 py-3" value={form.address || ''} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Address" /><textarea className="md:col-span-2 min-h-24 rounded-2xl border border-silk bg-ivory px-4 py-3" value={form.brandTagline || ''} onChange={(e) => setForm({ ...form, brandTagline: e.target.value })} placeholder="Brand tagline" /><textarea className="md:col-span-2 min-h-24 rounded-2xl border border-silk bg-ivory px-4 py-3" value={form.footerText || ''} onChange={(e) => setForm({ ...form, footerText: e.target.value })} placeholder="Footer text" /><div className="md:col-span-2 flex items-center gap-3"><button className="rounded-full bg-charcoal px-5 py-3 text-xs uppercase tracking-[0.24em] text-ivory">Save settings</button>{message ? <span className="text-sm text-emerald-700">{message}</span> : null}{error ? <span className="text-sm text-red-600">{error}</span> : null}</div></form></AdminShell>;
};
