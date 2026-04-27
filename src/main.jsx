import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { CartProvider } from './contexts/CartContext.jsx';
import { ProductProvider } from './contexts/ProductContext.jsx';
import './styles.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ProductProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </ProductProvider>
  </React.StrictMode>,
);
