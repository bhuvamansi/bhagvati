import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts, deleteProduct } from '../../../utils/api';
import { formatCurrency, titleCase } from '../../../utils/format';
import { AdminShell } from '../../../components/admin/AdminSection';

export const useCrud = (fetcher) => {
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

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

  React.useEffect(() => {
    load();
  }, []);

  return { items, loading, error, reload: load };
};

export const AdminProductsPage = () => {
  const navigate = useNavigate();
  const { items, error, reload } = useCrud(() => getProducts({ limit: 100 }));

  return (
    <AdminShell title="Products" description="Manage catalogue products." action={(<button
      onClick={() => navigate('/admin/products/create')}
      className="w-max inline-flex items-center justify-center rounded-full bg-charcoal px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
    >
      Create Product
    </button>)}>
      <div className="space-y-5">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-stone">
                <th className="py-3 text-left pl-1">Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id} className="border-t border-silk">
                  <td className="py-3 pl-1">
                    <div className="font-medium text-charcoal">{item.name}</div>
                    <div className="text-stone">{item.shortDescription}</div>
                  </td>
                  <td className="text-center">{titleCase(item.category)}</td>
                  <td className="text-center">{formatCurrency(item.price)}</td>
                  <td className="text-center">{titleCase(item.status)}</td>
                  <td className="space-x-1 text-center">
                    <button
                      className="text-stone"
                      onClick={() => navigate(`/admin/products/edit/${item._id}`)}
                    >
                      Edit
                    </button> |
                    <button
                      className="text-red-600"
                      onClick={async () => {
                        await deleteProduct(item._id);
                        reload();
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {error ? <div className="mt-4 text-red-600">{error}</div> : null}
        </div>
      </div>
    </AdminShell>
  );
};