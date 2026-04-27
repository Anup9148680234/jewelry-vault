import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { fallbackProducts } from '../data/fallbackProducts.js';
import { fetchShopifyProducts } from '../services/shopify.js';
import { normalizeProduct } from '../utils/product.js';
import React from 'react';

const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(() => fallbackProducts.map(normalizeProduct));
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');

    fetchShopifyProducts()
      .then((shopifyProducts) => {
        if (cancelled) return;
        if (shopifyProducts.length) {
          setProducts(shopifyProducts.map(normalizeProduct));
        }
        setStatus('ready');
      })
      .catch((shopifyError) => {
        if (cancelled) return;
        setError(shopifyError.message);
        setStatus('fallback');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(() => {
    const categories = unique(products.map((product) => product.category));
    const materials = unique(products.map((product) => product.material));

    const findProductByRouteHandle = (route) => {
      const handle = route.startsWith('/product/') ? decodeURIComponent(route.replace('/product/', '')) : '';
      return products.find((product) => product.handle === handle || product.id === handle);
    };

    return { products, status, error, categories, materials, findProductByRouteHandle };
  }, [error, products, status]);

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used inside ProductProvider.');
  }
  return context;
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}
