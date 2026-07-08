import { CartItem, Product } from "@/types/product";
import { useState } from "react";

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  function addToCart(product: Product) {
    setItems((prev) => {
      const exiting = prev.find((item) => item.product.id === product.id);
      if (exiting) {
        return prev.map((item) => item.product.id === product.id
        ? {...item, quantity: quantity: item.quantity + 1}
      : item);
      }
    });
  }
}
