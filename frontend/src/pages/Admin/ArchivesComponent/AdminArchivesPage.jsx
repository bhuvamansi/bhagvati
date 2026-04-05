import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminShell } from '../../../components/admin/AdminSection';
import { deleteArchive, getArchives } from '../../../utils/api';
import { useCrud } from '../ProductComponent/AdminProductsPage';

const titleCase = (value = '') =>
  value
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

export const AdminArchivesPage = () => {
  const navigate = useNavigate();
  const { items, error, reload } = useCrud(() => getArchives({ limit: 100 }));

  return (
    <AdminShell
      title="Archives"
      description="Manage press, exhibition, and collaboration content."
      action={
        <button
          onClick={() => navigate('/admin/archives/create')}
          className="w-max inline-flex items-center justify-center rounded-full bg-charcoal px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
        >
          Create Archive
        </button>
      }
    >
      <div className="overflow-x-auto rounded-[1.5rem] border border-black/5 p-5">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-stone">
              <th className="py-3 text-left">Title</th>
              <th className="text-left">Type</th>
              <th className="text-center">Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id} className="border-t border-silk">
                <td className="py-4">
                  <div className="font-medium text-charcoal">{item.title}</div>
                  <div className="text-stone">{item.excerpt}</div>
                </td>
                <td>{titleCase(item.type)}</td>
                <td>{titleCase(item.status)}</td>
                <td className="text-right">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      className="text-stone transition hover:text-charcoal"
                      onClick={() => navigate(`/admin/archives/edit/${item._id}`)}
                    >
                      Edit
                    </button>
                    |
                    <button
                      className="text-red-600 transition hover:opacity-80"
                      onClick={async () => {
                        await deleteArchive(item._id);
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