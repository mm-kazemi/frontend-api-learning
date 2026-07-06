import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "@/services/productService";
import { queryKeys } from "@/lib/queryKeys";

export function useCategories() {
  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: ({ signal }) => fetchCategories(signal),
    staleTime: Infinity,
  });

  return {
    categories: data ?? [],
    loading: isLoading,
    error: error?.message ?? null,
  };
}
