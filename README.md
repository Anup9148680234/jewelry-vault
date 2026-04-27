# Jewelry Vault

A responsive React storefront for a jewelry vault with Shopify Storefront API integration.

## Run locally

```bash
npm install
npm run dev
```

The app runs at `http://127.0.0.1:5173` by default.

## Shopify setup

Copy `.env.example` to `.env` and add:

```bash
VITE_SHOPIFY_STORE_DOMAIN=your-shop.myshopify.com
VITE_SHOPIFY_STOREFRONT_TOKEN=your-storefront-access-token
```

Without credentials, the app shows a sample jewelry catalogue so the homepage, filters, product
details, cart persistence, and checkout error handling can still be reviewed. With credentials, the
product grid fetches Shopify products and checkout creates a Shopify cart before redirecting to the
hosted checkout URL.

## Features

- Hero homepage with featured collections, trending products, and best sellers
- Product listing with Shopify data, search, category/material/price filters, and sorting
- Product detail gallery with variant selection and add to cart
- LocalStorage cart with quantity updates, removal, and subtotal
- Shopify cart creation and hosted checkout redirect
- Responsive layouts, loading notices, fallback data, and error states
