import React from 'react';

function Header({ cartCount, navigate, route }) {
  return (
    <header className="site-header">
      <button className="brand" onClick={() => navigate('/')} aria-label="Jewelry Vault home">
        <span className="brand-mark">JV</span>
        <span>Jewelry Vault</span>
      </button>
      <nav aria-label="Primary navigation">
        <button className={route === '/' ? 'active' : ''} onClick={() => navigate('/')}>
          Home
        </button>
        <button className={route === '/products' ? 'active' : ''} onClick={() => navigate('/products')}>
          Shop
        </button>
        <button className="cart-link" onClick={() => navigate('/cart')}>
          Cart <span>{cartCount}</span>
        </button>
      </nav>
    </header>
  );
}

export default Header;
