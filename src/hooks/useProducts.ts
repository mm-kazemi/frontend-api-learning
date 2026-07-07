import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { fetchProducts } from "@/services/productService";

export function useProducts(
  query: string,
  page: number,
  limit: number,
  category: string,
  sortBy: string,
  priceRange: [number, number]
) {
  const needsAllData = !!query || !!category;

  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.products.list(
      page,
      limit,
      query,
      category,
      sortBy,
      priceRange
    ),
    queryFn: ({ signal }) =>
      fetchProducts(
        {
          q: query || undefined,
          limit: needsAllData ? 100 : limit,
          skip: needsAllData ? 0 : (page - 1) * limit,
        },
        signal
      ),
    select: (data) => {
      const filtered = data.products
        .filter((p) => p.title.toLowerCase().includes(query.toLowerCase()))
        .filter((p) => (category ? p.category === category : true))
        .filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1])
        .sort((a, b) => {
          if (sortBy === "price") return a.price - b.price;
          if (sortBy === "rating") return b.rating - a.rating;
          return 0;
        });
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
