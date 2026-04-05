import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createProduct, getProducts, updateProduct } from '../../../utils/api';
import { AdminShell } from '../../../components/admin/AdminSection';

const defaultImage =
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80&auto=format&fit=crop';

const baseProduct = {
  name: '',
  shortDescription: '',
  description: '',
  price: '',
  category: 'sofa',
  material: 'fabric',
  roomCategory: 'living',
  coverImage: defaultImage,
  images: [defaultImage],
  featured: false,
  inStock: true,
  status: 'published',
};

export const PanelForm = ({
  fields,
  form,
  setForm,
  onSubmit,
  onCancel,
  submitLabel,
  editing,
  navigate,
}) => (
  <form className="grid gap-3 md:grid-cols-2" onSubmit={onSubmit}>
    {fields.map((field) => (
      <div key={field.name} className={field.full ? 'md:col-span-2' : ''}>
        <label className="mb-1 block text-xs uppercase tracking-[0.24em] text-stone">
          {field.label}
        </label>

        {field.type === 'textarea' ? (
          <textarea
            className="min-h-28 w-full rounded-2xl border border-silk bg-ivory px-4 py-3 outline-none"
            value={form[field.name] ?? ''}
            onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
          />
        ) : field.type === 'checkbox' ? (
          <label className="flex items-center gap-3 rounded-2xl border border-silk bg-ivory px-4 py-4">
            <input
              type="checkbox"
              checked={!!form[field.name]}
              onChange={(e) => setForm({ ...form, [field.name]: e.target.checked })}
            />
            <span>{field.help || field.label}</span>
          </label>
        ) : (
          <input
            className="w-full rounded-2xl border border-silk bg-ivory px-4 py-3 outline-none"
            type={field.type || 'text'}
            value={form[field.name] ?? ''}
            onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
            placeholder={field.placeholder || ''}
          />
        )}
      </div>
    ))}

    <div className="md:col-span-2">
      <label className="mb-1 block text-xs uppercase tracking-[0.24em] text-stone">
        Product Image Preview
      </label>

      <div className="overflow-hidden rounded-2xl border border-silk bg-ivory p-3">
        <img
          src={form.coverImage || form.images?.[0] || defaultImage}
          alt={form.name || 'Product preview'}
          className="h-64 w-full rounded-xl object-cover"
          onError={(e) => {
            e.target.src = defaultImage;
          }}
        />
      </div>
    </div>

    <div className="md:col-span-2 flex gap-3">
      <button
        type="submit"
        className="rounded-full bg-charcoal px-5 py-3 text-xs uppercase tracking-[0.24em] text-ivory"
      >
        {editing ? `Update ${submitLabel}` : `Create ${submitLabel}`}
      </button>

      <button
        type="button"
        onClick={onCancel}
        className="rounded-full border border-charcoal px-5 py-3 text-xs uppercase tracking-[0.24em]"
      >
        Cancel
      </button>
    </div>
  </form>
);

export const AdminProductFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const editing = !!id;

  const [form, setForm] = useState(baseProduct);
  const [loading, setLoading] = useState(editing);

  const fields = [
    { name: 'name', label: 'Name' },
    { name: 'price', label: 'Price', type: 'number' },
    { name: 'category', label: 'Category' },
    { name: 'material', label: 'Material' },
    { name: 'roomCategory', label: 'Room Category' },
    {
      name: 'coverImage',
      label: 'Product Image URL',
      type: 'text',
      full: true,
      placeholder: 'Paste image URL here',
    },
    { name: 'shortDescription', label: 'Short Description', full: true },
    { name: 'description', label: 'Description', type: 'textarea', full: true },
    { name: 'featured', label: 'Featured', type: 'checkbox' },
  ];

  useEffect(() => {
    const loadProduct = async () => {
      if (!editing) return;

      try {
        const response = await getProducts({ limit: 100 });
        const products = response?.data?.products || [];
        const item = products.find((p) => p._id === id);

        if (item) {
          const productImage =
            item.coverImage || item.images?.[0]?.url || defaultImage;

          setForm({
            ...baseProduct,
            ...item,
            coverImage: productImage,
            images: [productImage],
          });
        }
      } catch (error) {
        console.error('Failed to load product:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [editing, id]);

  const submit = async (e) => {
    e.preventDefault();

    const imageUrl = (form.coverImage || form.images?.[0] || '').trim();

    const payload = {
      ...form,
      price: Number(form.price || 0),
      coverImage: imageUrl,
      images: imageUrl
        ? [
          {
            url: imageUrl,
            alt: form.name || 'Product image',
          },
        ]
        : [],
    };

    if (editing) {
      await updateProduct(id, payload);
    } else {
      await createProduct(payload);
    }

    navigate('/admin/products');
  };

  if (loading) {
    return (
      <AdminShell title="Products" description="Manage catalogue products.">
        <div>Loading...</div>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      isEdit={true}
      title={editing ? 'Edit Product' : 'Create Product'}
      description={editing ? 'Update product details.' : 'Add a new product.'}
    >
      <div className="rounded-[1.5rem] border border-black/5 p-5">
        <PanelForm
          fields={fields}
          form={form}
          setForm={(updatedForm) => {
            setForm({
              ...updatedForm,
              images: [updatedForm.coverImage || defaultImage],
            });
          }}
          onSubmit={submit}
          submitLabel="product"
          editing={editing}
          navigate={navigate}
          onCancel={() => navigate('/admin/products')}
        />
      </div>
    </AdminShell>
  );
};