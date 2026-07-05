export const queryKeys = {
  products: {
    all: ["products"] as const,
    list: (page: number, limit: number, q: string) =>
      ["products", "list", { page, limit, q }] as const,
    detail: (id: number) => ["products", "detail", id] as const,
  },
};
