export const queryKeys = {
  products: {
    all: ["products"] as const,
    list: (
      page: number,
      limit: number,
      q: string,
      category: string,
      sortBy: string,
      priceRange: [number, number]
    ) =>
      [
        "products",
        "list",
        { page, limit, q, category, sortBy, priceRange },
      ] as const,
    detail: (id: number) => ["products", "detail", id] as const,
  },
  categories: {
    all: ["categories"] as const,
  },
};
