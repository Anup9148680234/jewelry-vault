import ProductRail from "../components/ProductRail.jsx";
import React from "react";

const collections = [
  { category: "Rings" },
  { category: "Necklaces" },
  { category: "Earrings" },
];

function HomePage({ products, openProduct, navigate }) {
  const bestSellers = products
    .filter((product) => product.tags.includes("best-seller"))
    .slice(0, 4);
  const trending = products
    .filter((product) => product.tags.includes("trending"))
    .slice(0, 4);

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <h1>Jewelry Vault</h1>
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vitae,
            molestias!
          </p>
          <div className="hero-actions">
            <button
              className="primary-button"
              onClick={() => navigate("/products")}
            >
              Shop collection
            </button>
            <button
              className="secondary-button"
              onClick={() => openProduct(products[0])}
            >
              View best seller
            </button>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <h2>Featured collections</h2>
        </div>
        <div className="collection-grid">
          {collections.map((collection) => (
            <button
              key={collection.category}
              className="collection-tile"
              onClick={() => navigate("/products")}
            >
              <strong>{collection.category}</strong>
            </button>
          ))}
        </div>
      </section>

      <ProductRail
        title="Trending now"
        products={trending.length ? trending : products.slice(0, 4)}
        openProduct={openProduct}
      />
      <ProductRail
        title="Best sellers"
        products={bestSellers.length ? bestSellers : products.slice(2, 6)}
        openProduct={openProduct}
      />
    </>
  );
}

export default HomePage;
