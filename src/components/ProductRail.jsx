import React from 'react';
import ProductCard from './ProductCard.jsx';

function ProductRail({ title, products, openProduct }) {
  return (
    <section className="section">
      <div className="section-heading">
        <h2>{title}</h2>
      </div>
      <div className="product-grid compact">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} openProduct={openProduct} />
        ))}
      </div>
    </section>
  );
}

export default ProductRail;
