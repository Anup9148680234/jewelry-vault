import React from 'react';
import { useMemo, useState } from 'react';
import Footer from './components/Footer.jsx';
import Header from './components/Header.jsx';
import TopNotice from './components/TopNotice.jsx';
import { useCart } from './contexts/CartContext.jsx';
import { useProducts } from './contexts/ProductContext.jsx';
import CartPage from './pages/CartPage.jsx';
import HomePage from './pages/HomePage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import ProductListingPage from './pages/ProductListingPage.jsx';
import { useHashRoute } from './utils/useHashRoute.js';

function App() {
  const { route, navigate } = useHashRoute();
  const { products, status, error, categories, materials, findProductByRouteHandle } = useProducts();
  const { count } = useCart();
  const [selectedProductId, setSelectedProductId] = useState('');

  const selectedProduct = useMemo(() => {
    const selected = products.find((product) => product.id === selectedProductId);
    return selected || findProductByRouteHandle(route) || products[0];
  }, [findProductByRouteHandle, products, route, selectedProductId]);

  const openProduct = (product) => {
    setSelectedProductId(product.id);
    navigate(`/product/${encodeURIComponent(product.handle || product.id)}`);
  };

  return (
    <>
      <Header cartCount={count} navigate={navigate} route={route} />
      {status === 'loading' && <TopNotice tone="loading">Loading Shopify products...</TopNotice>}
      {status === 'fallback' && (
        <TopNotice tone="warning">
          Shopify products could not be loaded. Showing sample jewelry catalogue. {error}
        </TopNotice>
      )}

      <main>
        {route === '/' && <HomePage products={products} openProduct={openProduct} navigate={navigate} />}
        {route === '/products' && (
          <ProductListingPage
            products={products}
            categories={categories}
            materials={materials}
            openProduct={openProduct}
          />
        )}
        {route.startsWith('/product/') && selectedProduct && (
          <ProductDetailPage product={selectedProduct} navigate={navigate} />
        )}
        {route === '/cart' && <CartPage navigate={navigate} />}
      </main>

      <Footer />
    </>
  );
}

export default App;
