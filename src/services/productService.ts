import type { Product, ProductsParams, ProductsResponse } from "@/types/product";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://dummyjson.com";

function handleError(status: number): never {
  if (status === 404) {
    throw new Error("محصول پیدا نشد");
  } else if (status >= 500) {
    throw new Error("مشکلی در سرور پیش آمده، دوباره تلاش کنید");
  } else {
    throw new Error("خطای غیرمنتظره‌ای رخ داد");
  }
}

export async function fetchProducts(
  params: ProductsParams = {},
  signal?: AbortSignal
): Promise<ProductsResponse> {
  const { limit = 15, skip = 0, q } = params;

  const url = q
    ? `${BASE_URL}/products/search?q=${encodeURIComponent(q)}&limit=${limit}&skip=${skip}`
    : `${BASE_URL}/products?limit=${limit}&skip=${skip}`;

  try{
    const response = await axios.get<ProductsResponse>(url, {signal})
    return response.data
  }catch (error) {
    if (axios.isAxiosError(error) && error.response){
      handleError(error.response.status)
    }
      throw error
  }
}

export async function fetchProductById(
  id: number,
  signal?: AbortSignal
): Promise<Product> {
  try{
    const response = await axios.get(`${BASE_URL}/products/${id}`, {signal})
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      handleError(error.response.status)
    }
    throw error
  }
}
