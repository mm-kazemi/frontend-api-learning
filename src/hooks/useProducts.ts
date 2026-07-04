"use client";

import { useState, useEffect } from "react";
import { fetchProducts } from "@/services/productService";
import type { Product } from "@/types/product";

interface UseProductsState {
  products: Product[];
  total: number;
  loading: boolean;
  error: string | null;
}

export function useProducts(query: string, page: number, limit: number) {
  const [state, setState] = useState<UseProductsState>({
    products: [],
    total: 0,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const controller = new AbortController();

    setState((prev) => ({ ...prev, loading: true, error: null }));

    fetchProducts(
      { q: query || undefined, limit, skip: (page - 1) * limit },
      controller.signal
    )
      .then((data) => {
        setState({
          products: data.products,
          total: data.total,
          loading: false,
          error: null,
        });
      })
      .catch((err: Error) => {
        if (err.name !== "AbortError" && err.name !== "CanceledError") {
          setState((prev) => ({
            ...prev,
            loading: false,
            error: err.message,
          }));
        }
      });

    return () => controller.abort();
  }, [query, page, limit]);

  return state;
}
