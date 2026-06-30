"use client";

import { useState, useEffect } from "react";
import { fetchProductById } from "@/services/productService";
import type { Product } from "@/types/product";

interface UseProductState {
  product: Product | null;
  loading: boolean;
  error: string | null;
}

export function useProduct(id: number) {
  const [state, setState] = useState<UseProductState>({
    product: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!id || isNaN(id)) {
      setState({ product: null, loading: false, error: "شناسه محصول نامعتبر است" });
      return;
    }

    const controller = new AbortController();

    setState({ product: null, loading: true, error: null });

    fetchProductById(id, controller.signal)
      .then((data) => {
        setState({ product: data, loading: false, error: null });
      })
      .catch((err: Error) => {
        if (err.name !== "AbortError") {
          setState({ product: null, loading: false, error: err.message });
        }
      });

    return () => controller.abort();
  }, [id]);

  return state;
}
