import { useEffect, useState } from "react";
import { useCart } from "../contexts/CartContext.jsx";
import { currency } from "../utils/currency.js";
import React from "react";

function ProductDetailPage({ product, navigate }) {
  const { addItem } = useCart();
  const [activeImage, setActiveImage] = useState(0);
  const [variantId, setVariantId] = useState(product.variants[0]?.id);
  const variant =
    product.variants.find((item) => item.id === variantId) ||
    product.variants[0];

  useEffect(() => {
    setActiveImage(0);
    setVariantId(product.variants[0]?.id);
  }, [product]);

  return (
    <section className="section detail-page">
      <div className="gallery">
        <img
          className="main-image"
          src={product.images[activeImage]}
          alt={product.title}
        />
        <div className="thumbs">
          {product.images.map((image, index) => (
            <button
              key={image}
              className={activeImage === index ? "active" : ""}
              onClick={() => setActiveImage(index)}
              aria-label={`Show image ${index + 1}`}
            >
              <img src={image} alt="" />
            </button>
          ))}
        </div>
      </div>

      <div className="detail-info">
      
        <h1>{product.title}</h1>
        <strong>{currency.format(Number(variant.price))}</strong>
        <p>{product.description}</p>

        <label>Variant</label>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {product.variants.map((item) => {
            const isSelected = item.id === variant?.id;

            return (
              <button
                key={item.id}
                onClick={() => setVariantId(item.id)}
                disabled={!item.availableForSale}
                style={{
                  padding: "8px 12px",
                  borderRadius: 20,
                  border: isSelected ? "2px solid black" : "1px solid #ccc",
                  background: isSelected ? "#000" : "#fff",
                  color: isSelected ? "#fff" : "#000",
                  cursor: item.availableForSale ? "pointer" : "not-allowed",
                  opacity: item.availableForSale ? 1 : 0.4,
                }}
              >
                {item.title}
              </button>
            );
          })}
        </div>

        <button
          className="primary-button"
          disabled={!variant?.availableForSale}
          onClick={() => {
            addItem(product, variant, 1);
            navigate("/cart");
          }}
        >
          Add to cart
        </button>
      </div>
    </section>
  );
}

export default ProductDetailPage;
