export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface ProductsParams {
  limit?: number;
  skip?: number;
  q?: string;
}

export interface Category {
  slug: string;
  name: string;
  url: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
