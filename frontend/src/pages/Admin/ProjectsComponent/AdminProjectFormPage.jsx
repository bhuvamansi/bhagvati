import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminShell } from '../../../components/admin/AdminSection';
import { createProject, getProjects, updateProject } from '../../../utils/api';
import { PanelForm } from '../ProductComponent/AdminProductFormPage';

const defaultImage =
  'https://images.unsplash.com/photo-1494526585095-c41746248156?w=1200&q=80&auto=format&fit=crop';

const baseProject = {
  title: '',
  location: '',
  year: new Date().getFullYear(),
  category: 'residential',
  summary: '',
  description: '',
  featured: false,
  coverImage: defaultImage,
  images: [defaultImage],
  status: 'published',
};

export const AdminProjectFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const editing = !!id;

  const [form, setForm] = useState(baseProject);
  const [loading, setLoading] = useState(editing);

  const fields = [
    { name: 'title', label: 'Title' },
    { name: 'location', label: 'Location' },
    { name: 'year', label: 'Year', type: 'number' },
    { name: 'category', label: 'Category' },
    {
      name: 'coverImage',
      label: 'Project Image URL',
      type: 'text',
      full: true,
      placeholder: 'Paste image URL here',
    },
    { name: 'summary', label: 'Summary', full: true },
    { name: 'description', label: 'Description', type: 'textarea', full: true },
    { name: 'featured', label: 'Featured', type: 'checkbox' },
  ];

  useEffect(() => {
    const loadProject = async () => {
      if (!editing) return;

      try {
        const response = await getProjects({ limit: 100 });
        const projects =
          response?.data?.projects ||
          response?.projects ||
          response?.data ||
          [];

        const item = Array.isArray(projects)
          ? projects.find((p) => p._id === id)
          : [];

        if (item) {
          const projectImage =
            item.coverImage || item.images?.[0]?.url || defaultImage;

          setForm({
            ...baseProject,
            ...item,
            coverImage: projectImage,
            images: [projectImage],
          });
        }
      } catch (error) {
        console.error('Failed to load project:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [editing, id]);

  const submit = async (e) => {
    e.preventDefault();

    const imageUrl = (form.coverImage || form.images?.[0] || '').trim();

    const payload = {
      ...form,
      year: Number(form.year || new Date().getFullYear()),
      coverImage: imageUrl,
      images: imageUrl
        ? [
            {
              url: imageUrl,
              alt: form.title || 'Project image',
            },
          ]
        : [],
    };

    if (editing) {
      await updateProject(id, payload);
    } else {
      await createProject(payload);
    }

    navigate('/admin/projects');
  };

  if (loading) {
    return (
      <AdminShell
        isEdit={true}
        title="Projects"
        description="Manage project portfolio entries."
      >
        <div>Loading...</div>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      isEdit={true}
      title={editing ? 'Edit Project' : 'Create Project'}
      description={editing ? 'Update project details.' : 'Add a new project.'}
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
          submitLabel="project"
          editing={editing}
          navigate={(path) => navigate(path)}
          onCancel={() => navigate('/admin/projects')}
        />
      </div>
    </AdminShell>
  );
};