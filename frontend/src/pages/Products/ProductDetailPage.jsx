import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getProductById } from '../../utils/api';
import { useCart } from '../../context/CartContext';
import { formatCurrency, titleCase } from '../../utils/format';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { dispatch } = useCart();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);

  useEffect(() => {
    getProductById(id)
      .then((res) => setProduct(res?.data?.product || null))
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) return <div className="pt-32 px-8 text-red-600">{error}</div>;
  if (!product) return <div className="pt-32 px-8 text-stone">Loading product...</div>;

  const handleAdd = () => {
    dispatch({ type: 'ADD_ITEM', payload: { _id: product._id, name: product.name, price: product.price, img: product.coverImage || product.images?.[0]?.url } });
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div className="pt-32 pb-24">
      <div className="mx-auto grid max-w-screen-xl gap-12 px-8 lg:grid-cols-2 lg:px-16">
        <div className="overflow-hidden rounded-[2rem] bg-cream" style={{ aspectRatio: '4/5' }}>
          <img src={product.coverImage || product.images?.[0]?.url} alt={product.name} className="h-full w-full object-cover" />
        </div>
        <div>
          <Link to="/products" className="text-xs uppercase tracking-[0.24em] text-stone underline-link">Back to products</Link>
          <p className="mt-8 text-xs uppercase tracking-[0.24em] text-stone">{titleCase(product.category)} • {titleCase(product.roomCategory)}</p>
          <h1 className="mt-4 font-serif-display text-6xl text-charcoal">{product.name}</h1>
          <p className="mt-4 text-lg text-stone">{formatCurrency(product.price)}</p>
          <p className="mt-8 text-sm leading-7 text-stone">{product.description}</p>
          <div className="mt-8 grid gap-4 rounded-[1.5rem] bg-cream p-5 text-sm text-charcoal">
            <div><strong>Primary material:</strong> {titleCase(product.material)}</div>
            <div><strong>Status:</strong> {titleCase(product.status)}</div>
            <div><strong>Stock:</strong> {product.inStock ? 'Available' : 'Made to order'}</div>
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            <button onClick={handleAdd} className="rounded-full bg-charcoal px-6 py-4 text-xs uppercase tracking-[0.28em] text-ivory">{added ? 'Added' : 'Add to cart'}</button>
            <Link to="/bespoke" className="rounded-full border border-charcoal px-6 py-4 text-xs uppercase tracking-[0.28em] text-charcoal">Enquire now</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
