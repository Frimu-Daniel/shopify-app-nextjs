"use client";

import Image from "next/image";
import {FormEvent, useState} from "react";

type ProductResponse = {
  id: string;
  title: string;
  description: string;
  featuredImage: {
    url: string;
    altText: string | null;
  } | null;
};

export default function Home() {
  const [productId, setProductId] = useState("");
  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!/^\d+$/.test(productId.trim())) {
      setError("Enter a valid numeric product ID.");
      setProduct(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/products/${productId.trim()}`);
      const data = await response.json();

      if (!response.ok) {
        setProduct(null);
        setError(data.error ?? "Unable to load product.");
        return;
      }

      setProduct(data.product as ProductResponse);
    } catch {
      setProduct(null);
      setError("Request failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full flex flex-1 items-center justify-center bg-zinc-100 p-6">
      <main className="w-full max-w-2xl rounded-xl border border-zinc-200 bg-white p-6 shadow-lg">
        <h1 className="text-2xl font-semibold text-zinc-900">Product Lookup</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Enter a Shopify product numeric ID (for example: 12345666677).
        </p>

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            inputMode="numeric"
            value={productId}
            onChange={(event) => setProductId(event.target.value)}
            placeholder="12345666677"
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 outline-none focus:border-zinc-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-zinc-900 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Loading..." : "Get product"}
          </button>
        </form>

        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

        {product ? (
          <section className="mt-6 rounded-lg border border-zinc-200 p-4">
            <h2 className="text-xl font-semibold text-zinc-900">{product.title}</h2>
            <p className="mt-3 whitespace-pre-wrap text-zinc-700">{product.description}</p>

            {product.featuredImage ? (
              <div className="mt-4 overflow-hidden rounded-lg border border-zinc-200">
                <Image
                  src={product.featuredImage.url}
                  alt={product.featuredImage.altText ?? product.title}
                  width={1024}
                  height={1024}
                  className="h-auto w-full"
                />
              </div>
            ) : (
              <p className="mt-4 text-sm text-zinc-500">No featured image for this product.</p>
            )}
          </section>
        ) : null}
      </main>
    </div>
  );
}
