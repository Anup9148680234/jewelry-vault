import React from 'react';

import { currency } from '../utils/currency.js';

function ProductCard({ product, openProduct }) {
  return (
    <article className="product-card">
      <button onClick={() => openProduct(product)} aria-label={`View ${product.title}`}>
        <img src={product.images[0]} alt={product.title} />
      </button>
      <div>
        <p>{product.category}</p>
        <h3>{product.title}</h3>
        <span>{currency.format(product.price)}</span>
      </div>
    </article>
  );
}

export default ProductCard;
