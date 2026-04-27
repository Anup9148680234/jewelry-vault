const placeholderImage =
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80';

export function normalizeProduct(product) {
  const variants = product.variants?.length
    ? product.variants
    : [
        {
          id: product.id,
          title: 'Default',
          price: product.price,
          availableForSale: true,
          selectedOptions: [],
        },
      ];

  const prices = variants.map((variant) => Number(variant.price)).filter(Number.isFinite);

  return {
    ...product,
    tags: product.tags || [],
    images: product.images?.length ? product.images : [placeholderImage],
    variants,
    price: prices.length ? Math.min(...prices) : Number(product.price || 0),
  };
}
