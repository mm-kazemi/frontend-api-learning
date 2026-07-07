import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { fetchProductById } from "@/services/productService";

export function useProduct(id: number) {
  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: ({ signal }) => fetchProductById(id, signal),
    enabled: !!id && !isNaN(id),
  });

  return {
    product: data ?? null,
    loading: isLoading,
    error: error?.message ?? null,
  };
}
