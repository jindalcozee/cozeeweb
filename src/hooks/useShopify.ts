import { useState, useEffect } from 'react';
import { shopifyFetch, getProductsQuery } from '../lib/shopify';

export interface ShopifyProduct {
  id: string; // The Handle or ID used for routing (we should use Handle for nice URLs, but ID is fine)
  variantId: string;
  title: string;
  description: string;
  price: string;
  originalPrice: string | null;
  image: string;
  images: string[];
  category: string;
}

export function useShopifyProducts() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      const { body } = await shopifyFetch({
        query: getProductsQuery,
        variables: { first: 20 },
      });

      if (body?.data?.products?.edges) {
        const fetchedProducts = body.data.products.edges.map(({ node }: any) => {
          const priceStr = `${node.priceRange.minVariantPrice.amount} ${node.priceRange.minVariantPrice.currencyCode || 'INR'}`;
          let originalPrice = null;
          if (node.compareAtPriceRange?.minVariantPrice) {
             originalPrice = `${node.compareAtPriceRange.minVariantPrice.amount} ${node.compareAtPriceRange.minVariantPrice.currencyCode || 'INR'}`;
          }

          const images = node.images.edges.map((e: any) => e.node.url);
          const variantId = node.variants.edges[0]?.node?.id;

          return {
            id: node.handle, // Use handle for readable URLs
            variantId: variantId,
            title: node.title,
            description: node.description,
            price: priceStr,
            originalPrice: originalPrice,
            image: images[0] || '/navyyy_transparent.png', // Fallback to local image if they didn't upload one
            images: images.length > 0 ? images : ['/navyyy_transparent.png'],
            category: 'Originals', // Hardcoded safely for their UI layout
          };
        });

        setProducts(fetchedProducts);
      }
      setLoading(false);
    }

    fetchProducts();
  }, []);

  return { products, loading };
}
