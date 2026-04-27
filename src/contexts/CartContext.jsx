import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import React from 'react';

const STORAGE_KEY = 'jewelry-vault-cart';
const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo(() => {
    const addItem = (product, variant, quantity = 1) => {
      setItems((current) => {
        const existing = current.find((item) => item.variantId === variant.id);
        if (existing) {
          return current.map((item) =>
            item.variantId === variant.id ? { ...item, quantity: item.quantity + quantity } : item,
          );
        }

        return [
          ...current,
          {
            productId: product.id,
            variantId: variant.id,
            title: product.title,
            variantTitle: variant.title,
            image: product.images[0],
            price: Number(variant.price),
            quantity,
          },
        ];
      });
    };

    const updateQuantity = (variantId, quantity) => {
      setItems((current) =>
        current
          .map((item) => (item.variantId === variantId ? { ...item, quantity: Math.max(0, quantity) } : item))
          .filter((item) => item.quantity > 0),
      );
    };

    const removeItem = (variantId) => {
      setItems((current) => current.filter((item) => item.variantId !== variantId));
    };

    const clearCart = () => setItems([]);
    const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
    const count = items.reduce((total, item) => total + item.quantity, 0);

    return { items, addItem, updateQuantity, removeItem, clearCart, subtotal, count };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used inside CartProvider.');
  }
  return context;
}
