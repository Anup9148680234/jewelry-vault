const shopifyConfig = {
  domain: normalizeDomain(import.meta.env.VITE_SHOPIFY_STORE_DOMAIN),
  token: import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN?.trim(),
  apiVersion: import.meta.env.VITE_SHOPIFY_API_VERSION?.trim() || '2025-10',
};

const productsQuery = `
  query Products {
    products(first: 40) {
      edges {
        node {
          id
          handle
          title
          description
          productType
          tags
          options {
            name
            values
          }
          priceRange {
            minVariantPrice {
              amount
            }
          }
          images(first: 6) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 20) {
            edges {
              node {
                id
                title
                availableForSale
                selectedOptions {
                  name
                  value
                }
                price {
                  amount
                }
              }
            }
          }
        }
      }
    }
  }
`;

const checkoutMutation = `
  mutation CartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export async function fetchShopifyProducts() {
  if (!isConfigured()) {
    throw new Error('Add VITE_SHOPIFY_STORE_DOMAIN and VITE_SHOPIFY_STOREFRONT_TOKEN to use live Shopify products.');
  }

  const data = await shopifyRequest(productsQuery);
  return data.products.edges.map(({ node }) => {
    const variants = node.variants.edges.map(({ node: variant }) => ({
      id: variant.id,
      title: variant.title,
      availableForSale: variant.availableForSale,
      selectedOptions: variant.selectedOptions,
      price: Number(variant.price.amount),
    }));

    return {
      id: node.id,
      handle: node.handle,
      title: node.title,
      description: node.description,
      category: node.productType || 'Jewelry',
      material: findMaterial(node),
      price: Number(node.priceRange.minVariantPrice.amount),
      tags: node.tags.map((tag) => tag.toLowerCase()),
      images: node.images.edges.map(({ node: image }) => image.url),
      variants,
    };
  });
}

export async function createShopifyCheckout(items) {
  if (!items.length) {
    throw new Error('Your cart is empty.');
  }

  if (!isConfigured()) {
    throw new Error('Shopify credentials are missing. Add them to .env before checkout.');
  }

  const input = {
    lines: items.map((item) => ({
      merchandiseId: item.variantId,
      quantity: item.quantity,
    })),
  };

  const data = await shopifyRequest(checkoutMutation, { input });
  const errors = data.cartCreate.userErrors;
  if (errors.length) {
    throw new Error(errors.map((error) => error.message).join(' '));
  }

  return data.cartCreate.cart.checkoutUrl;
}

async function shopifyRequest(query, variables) {
  const response = await fetch(`https://${shopifyConfig.domain}/api/${shopifyConfig.apiVersion}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': shopifyConfig.token,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Shopify request failed with status ${response.status}.`);
  }

  const payload = await response.json();
  if (payload.errors?.length) {
    throw new Error(payload.errors.map((error) => error.message).join(' '));
  }

  return payload.data;
}

function isConfigured() {
  return Boolean(shopifyConfig.domain && shopifyConfig.token);
}

function normalizeDomain(value) {
  return value?.trim().replace(/^https?:\/\//, '').replace(/\/$/, '');
}

function findMaterial(product) {
  const materialOption = product.options.find((option) => /material|metal/i.test(option.name));
  if (materialOption?.values?.[0]) return materialOption.values[0];

  const materialTag = product.tags.find((tag) => /^material[:\-_ ]/i.test(tag));
  if (materialTag) return materialTag.replace(/^material[:\-_ ]/i, '');

  return 'Mixed Metal';
}
