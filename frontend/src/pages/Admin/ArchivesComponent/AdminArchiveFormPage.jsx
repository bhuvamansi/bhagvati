import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminShell } from '../../../components/admin/AdminSection';
import { createArchive, getArchives, updateArchive } from '../../../utils/api';
import { PanelForm } from '../ProductComponent/AdminProductFormPage';

const defaultImage =
  'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&q=80&auto=format&fit=crop';

const baseArchive = {
  title: '',
  type: 'press',
  excerpt: '',
  content: '',
  featured: false,
  status: 'published',
  coverImage: defaultImage,
  images: [defaultImage],
};

export const AdminArchiveFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const editing = !!id;

  const [form, setForm] = useState(baseArchive);
  const [loading, setLoading] = useState(editing);

  const fields = [
    { name: 'title', label: 'Title' },
    { name: 'type', label: 'Type' },
    {
      name: 'coverImage',
      label: 'Archive Image URL',
      type: 'text',
      full: true,
      placeholder: 'Paste image URL here',
    },
    { name: 'excerpt', label: 'Excerpt', full: true },
    { name: 'content', label: 'Content', type: 'textarea', full: true },
    { name: 'featured', label: 'Featured', type: 'checkbox' },
  ];

  useEffect(() => {
    const loadArchive = async () => {
      if (!editing) return;

      try {
        const response = await getArchives({ limit: 100 });
        const archives =
          response?.data?.archives ||
          response?.archives ||
          response?.data ||
          [];

        const item = Array.isArray(archives)
          ? archives.find((archive) => archive._id === id)
          : null;

        if (item) {
          const archiveImage =
            item.coverImage || item.images?.[0]?.url || defaultImage;

          setForm({
            ...baseArchive,
            ...item,
            coverImage: archiveImage,
            images: [archiveImage],
          });
        }
      } catch (error) {
        console.error('Failed to load archive:', error);
      } finally {
        setLoading(false);
      }
    };

    loadArchive();
  }, [editing, id]);

  const submit = async (e) => {
    e.preventDefault();

    const imageUrl = (form.coverImage || form.images?.[0] || '').trim();

    const payload = {
      ...form,
      coverImage: imageUrl,
      images: imageUrl
        ? [
            {
              url: imageUrl,
              alt: form.title || 'Archive image',
            },
          ]
        : [],
    };

    if (editing) {
      await updateArchive(id, payload);
    } else {
      await createArchive(payload);
    }

    navigate('/admin/archives');
  };

  if (loading) {
    return (
      <AdminShell
        isEdit={true}
        title="Archives"
        description="Manage press, exhibition, and collaboration content."
      >
        <div>Loading...</div>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      isEdit={true}
      title={editing ? 'Edit Archive' : 'Create Archive'}
      description={
        editing
          ? 'Update archive details.'
          : 'Add a new archive entry.'
      }
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
          submitLabel="archive"
          editing={editing}
          navigate={(path) => navigate(path)}
          onCancel={() => navigate('/admin/archives')}
        />
      </div>
    </AdminShell>
  );
};