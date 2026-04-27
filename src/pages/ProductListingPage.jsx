import { useMemo, useState } from 'react';
import ProductCard from '../components/ProductCard.jsx';
import SelectField from '../components/SelectField.jsx';
import React from 'react';

function ProductListingPage({ products, categories, materials, openProduct }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [material, setMaterial] = useState('All');
  const [price, setPrice] = useState('All');
  const [sort, setSort] = useState('featured');

  const filteredProducts = useMemo(() => {
    const priceRanges = {
      'Under 100': [0, 100],
      '100 to 250': [100, 250],
      '250 and up': [250, Infinity],
    };

    return products
      .filter((product) => product.title.toLowerCase().includes(search.toLowerCase()))
      .filter((product) => category === 'All' || product.category === category)
      .filter((product) => material === 'All' || product.material === material)
      .filter((product) => {
        if (price === 'All') return true;
        const [min, max] = priceRanges[price];
        return product.price >= min && product.price < max;
      })
      .sort((a, b) => {
        if (sort === 'price-asc') return a.price - b.price;
        if (sort === 'price-desc') return b.price - a.price;
        if (sort === 'name') return a.title.localeCompare(b.title);
        return Number(b.tags.includes('trending')) - Number(a.tags.includes('trending'));
      });
  }, [products, search, category, material, price, sort]);

  return (
    <section className="section listing-page">
      <div className="section-heading wide">
        <h1>{category}</h1>
      </div>

      <div className="filters" aria-label="Product filters">
        <label>
          Search
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search jewelry" />
        </label>
        <SelectField label="Category" value={category} onChange={setCategory} options={['All', ...categories]} />
        <SelectField label="Material" value={material} onChange={setMaterial} options={['All', ...materials]} />
        <SelectField
          label="Price"
          value={price}
          onChange={setPrice}
          options={['All', 'Under 100', '100 to 250', '250 and up']}
        />
        <SelectField
          label="Sort"
          value={sort}
          onChange={setSort}
          options={[
            ['featured', 'Featured'],
            ['price-asc', 'Price low to high'],
            ['price-desc', 'Price high to low'],
            ['name', 'Name'],
          ]}
        />
      </div>

      {filteredProducts.length ? (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} openProduct={openProduct} />
          ))}
        </div>
      ) : (
        <div className="empty-state">No products match those filters.</div>
      )}
    </section>
  );
}

export default ProductListingPage;
