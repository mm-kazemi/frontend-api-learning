import type { Product, ProductsParams, ProductsResponse } from "@/types/product";

const BASE_URL = "https://dummyjson.com"

export async function fetchProducts(
  params: ProductsParams = {},
  signal?: AbortSignal
): Promise<ProductsResponse> {
  const { limit = 15, skip = 0, q } = params;

  const url = q
    ? `${BASE_URL}/products/search?q=${encodeURIComponent(q)}&limit=${limit}&skip=${skip}`
    : `${BASE_URL}/products?limit=${limit}&skip=${skip}`;

  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.status}`);
  }

  return response.json() as Promise<ProductsResponse>;
}

export async function fetchProductById(
  id: number,
  signal?: AbortSignal
): Promise<Product> {
  const response = await fetch(`${BASE_URL}/products/${id}`, { signal });

  if (!response.ok) {
    throw new Error(`Failed to fetch product ${id}: ${response.status}`);
  }

  return response.json() as Promise<Product>;
}
