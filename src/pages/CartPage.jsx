import { useState } from "react";
import { useCart } from "../contexts/CartContext.jsx";
import { createShopifyCheckout } from "../services/shopify.js";
import { currency } from "../utils/currency.js";
import React from "react";

function CartPage({ navigate }) {
  const cart = useCart();
  const [checkoutStatus, setCheckoutStatus] = useState("idle");
  const [checkoutError, setCheckoutError] = useState("");

  const startCheckout = async () => {
    setCheckoutStatus("loading");
    setCheckoutError("");
    try {
      const checkoutUrl = await createShopifyCheckout(cart.items);
      window.location.href = checkoutUrl;
    } catch (checkoutIssue) {
      setCheckoutError(checkoutIssue.message);
      setCheckoutStatus("error");
    }
  };

  return (
    <section className="section cart-page">
      <div className="section-heading wide">
    
        <h1>Your cart </h1>
      </div>

      {cart.items.length ? (
        <div className="cart-layout">
          <div className="cart-items">
            {cart.items.map((item) => (
              <article className="cart-item" key={item.variantId}>
                <img src={item.image} alt={item.title} />
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.variantTitle}</p>
                  <button onClick={() => cart.removeItem(item.variantId)}>
                    Remove
                  </button>
                </div>
                <div className="quantity">
                  <button
                    className="qty-btn"
                    onClick={() =>
                    
                      cart.updateQuantity(item.variantId, item.quantity - 1)
                    }
                  >
                    −
                  </button>

                  <span className="qty-value">{item.quantity}</span>

                  <button
                    className="qty-btn"
                    onClick={() =>
                      cart.updateQuantity(item.variantId, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>
                <strong>{currency.format(item.price * item.quantity)}</strong>
              </article>
            ))}
          </div>

          <aside className="summary">
            <h2>Summary</h2>
            <div>
              <span>Subtotal</span>
              <strong>{currency.format(cart.subtotal)}</strong>
            </div>
            <button
              className="primary-button"
              onClick={startCheckout}
              disabled={checkoutStatus === "loading"}
            >
              {checkoutStatus === "loading"
                ? "Creating checkout..."
                : "Proceed to checkout"}
            </button>
            {checkoutError && <p className="error-text">{checkoutError}</p>}
          </aside>
        </div>
      ) : (
        <div className="empty-state">
          Your cart is empty.
          <button
            className="primary-button"
            onClick={() => navigate("/products")}
          >
            Shop jewelry
          </button>
        </div>
      )}
    </section>
  );
}

export default CartPage;
