"use client";

import Link from "next/link";
import { useCartContext } from "@/context/CartContext";
import styles from "./cart.module.css";

export default function CartPage() {
  const {
    items,
    totalItems,
    totalPrice,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
  } = useCartContext();

  if (items.length === 0) {
    return (
      <div className={styles.centered}>
        <p className={styles.emptyIcon}>🛒</p>
        <p className={styles.emptyTitle}>سبد خرید شما خالی است</p>
        <Link href="/products" className={styles.backLink}>
          ← مشاهده محصولات
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Link href="/products" className={styles.backLink}>
            ← ادامه خرید
          </Link>
          <h1 className={styles.pageTitle}>سبد خرید ({totalItems} کالا)</h1>
          <button onClick={clearCart} className={styles.clearBtn}>
            خالی کردن سبد
          </button>
        </div>

        <div className={styles.itemList}>
          {items.map((item) => (
            <div key={item.product.id} className={styles.item}>
              <img
                src={item.product.thumbnail}
                alt={item.product.title}
                className={styles.itemImage}
              />

              <div className={styles.itemInfo}>
                <h2 className={styles.itemTitle}>{item.product.title}</h2>
                <p className={styles.itemPrice}>
                  ${item.product.price.toFixed(2)}
                </p>
              </div>

              <div className={styles.quantityControls}>
                <button
                  onClick={() => decreaseQuantity(item.product.id)}
                  className={styles.qtyBtn}
                >
                  −
                </button>
                <span className={styles.qtyValue}>{item.quantity}</span>
                <button
                  onClick={() => increaseQuantity(item.product.id)}
                  className={styles.qtyBtn}
                >
                  +
                </button>
              </div>

              <p className={styles.itemTotal}>
                ${(item.product.price * item.quantity).toFixed(2)}
              </p>

              <button
                onClick={() => removeFromCart(item.product.id)}
                className={styles.removeBtn}
                aria-label="حذف از سبد"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div className={styles.summary}>
          <span className={styles.summaryLabel}>جمع کل:</span>
          <span className={styles.summaryValue}>${totalPrice.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
