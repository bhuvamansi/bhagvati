import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getProducts } from '../../utils/api';
import { formatCurrency, titleCase } from '../../utils/format';

const categories = ['all', 'sofa', 'table', 'chair', 'bed', 'storage', 'desk'];

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const category = searchParams.get('category') || '';

  useEffect(() => {
    getProducts({ category: category || undefined, limit: 100 })
      .then((res) => setProducts(res?.data?.products || []))
      .catch((err) => setError(err.message));
  }, [category]);

  return (
    <div className="pt-32 pb-24">
      <div className="mx-auto max-w-screen-xl px-8 lg:px-16">
        <p className="tracking-label text-stone">Catalogue</p>
        <h1 className="mt-4 font-serif-display text-6xl text-charcoal">Products</h1>
        <div className="mt-10 flex flex-wrap gap-4">
          {categories.map((item) => (
            <Link key={item} to={item === 'all' ? '/products' : `/products?category=${item}`} className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.24em] ${(!category && item==='all') || category===item ? 'bg-charcoal text-ivory' : 'bg-cream text-charcoal'}`}>
              {titleCase(item)}
            </Link>
          ))}
        </div>

        {error ? <div className="mt-8 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div> : null}

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <Link key={product._id} to={`/products/${product.slug || product._id}`} className="group block">
              <div className="overflow-hidden rounded-[1.5rem] bg-cream" style={{ aspectRatio: '3/4' }}>
                <img src={product.coverImage || product.images?.[0]?.url} alt={product.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              </div>
              <p className="mt-4 text-xs uppercase tracking-[0.24em] text-stone">{titleCase(product.category)}</p>
              <h3 className="mt-2 font-serif-display text-3xl text-charcoal">{product.name}</h3>
              <p className="mt-2 text-sm text-stone">{formatCurrency(product.price)}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
