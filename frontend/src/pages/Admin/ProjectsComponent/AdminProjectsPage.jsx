import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminShell } from '../../../components/admin/AdminSection';
import { getProjects, deleteProject } from '../../../utils/api';
import { useCrud } from '../ProductComponent/AdminProductsPage';

export const AdminProjectsPage = () => {
  const navigate = useNavigate();
  const { items, error, reload } = useCrud(() => getProjects({ limit: 100 }));

  return (
    <AdminShell
      title="Projects"
      description="Manage project portfolio entries."
      action={
        <button
          onClick={() => navigate('/admin/projects/create')}
          className="w-max inline-flex items-center justify-center rounded-full bg-charcoal px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
        >
          Create Project
        </button>
      }
    >
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-stone">
              <th className="py-3 text-left pl-1">Project</th>
              <th className="text-left">Location</th>
              <th className="text-center">Year</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr key={item._id} className="border-t border-silk">
                <td className="py-4 pl-1">
                  <div className="font-medium text-charcoal">{item.title}</div>
                  <div className="text-stone">{item.summary}</div>
                </td>
                <td className="text-left">{item.location}</td>
                <td className="text-center">{item.year}</td>
                <td className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      className="text-stone transition hover:text-charcoal"
                      onClick={() => navigate(`/admin/projects/edit/${item._id}`)}
                    >
                      Edit
                    </button>
                    |
                    <button
                      className="text-red-600 transition hover:opacity-80"
                      onClick={async () => {
                        await deleteProject(item._id);
                        reload();
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {error ? <div className="mt-4 text-red-600">{error}</div> : null}
      </div>
    </AdminShell>
  );
};