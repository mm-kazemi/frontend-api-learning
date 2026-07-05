import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { fetchProducts } from "@/services/productService";

export function useProducts(query: string, page: number, limit: number) {
  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.products.list(page, limit, query),
    queryFn: ({ signal }) =>
      fetchProducts(
        {
          q: query || undefined,
          limit: query ? 100 : limit,
          skip: query ? 0 : (page - 1) * limit,
        },
        signal
      ),
    select: (data) => {
      const filtered = data.products.filter((p) =>
        p.title.toLowerCase().includes(query.toLowerCase())
      );
      const start = (page - 1) * limit;
      const paginated = filtered.slice(start, start + limit);

      return {
        ...data,
        products: paginated,
        total: filtered.length,
      };
    },
  });

  return {
    products: data?.products ?? [],
    total: data?.total ?? 0,
    loading: isLoading,
    error: error?.message ?? null,
  };
}
