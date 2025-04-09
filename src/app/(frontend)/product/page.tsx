import React from 'react';
import Image from 'next/image';
import { Product } from '@/payload-types';

export default async function ProductsPage() {
  const products = await fetchProducts();

  return (
    <div>
      <h1>Products</h1>
      {products.map((product) => {
        const firstImageEntry = product.images?.[0];
        const firstImage = firstImageEntry?.image;
        const imageUrl =
          typeof firstImage === 'object' && firstImage?.url
            ? firstImage.url
            : null;

        return (
          <div key={product.id}>
            <h2>
              {product.name} — $
              {((product.price || 0) / 100).toFixed(2)}
            </h2>
            {imageUrl && (
              <Image
                src={imageUrl}
                alt={firstImageEntry?.altText || product.name}
                width={500}
                height={300}
              />
            )}
            {product.description && (
              <div dangerouslySetInnerHTML={{ __html: product.description }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

const fetchProducts = async (): Promise<Product[]> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_PAYLOAD_API_URL}/api/products?depth=2`,
    {

      next: { revalidate: 10 },
    }
  );
  const data = await res.json();
  return data.docs as Product[];
};