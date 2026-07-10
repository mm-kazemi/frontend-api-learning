"use client";

import { use } from "react";
import Link from "next/link";
import { useProduct } from "@/hooks/useProduct";
import styles from "./product.module.css";
import { useCartContext } from "@/context/CartContext";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { product, loading, error } = useProduct(Number(id));
  const { addToCart, items } = useCartContext();

  const isInCart = items.some((item) => item.product.id === product?.id);

  if (loading) {
    return (
      <div className={styles.centered}>
        <div className={styles.spinner} />
        <p>در حال بارگذاری...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className={styles.centered}>
        <p className={styles.errorMsg}>{error ?? "محصول پیدا نشد"}</p>
        <Link href="/products" className={styles.backLink}>
          ← بازگشت به محصولات
        </Link>
      </div>
    );
  }

  const discountedPrice =
    product.price * (1 - product.discountPercentage / 100);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <Link href="/products" className={styles.backLink}>
          ← بازگشت به محصولات
        </Link>

        <div className={styles.detail}>
          {/* Gallery */}
          <div className={styles.gallery}>
            <div className={styles.mainImageWrap}>
              <img
                src={product.thumbnail}
                alt={product.title}
                className={styles.mainImage}
              />
            </div>
            {product.images.length > 1 && (
              <div className={styles.thumbList}>
                {product.images.slice(0, 5).map((img, i) => (
                  <div key={i} className={styles.thumbWrap}>
                    <img
                      src={img}
                      alt={`${product.title} — تصویر ${i + 1}`}
                      className={styles.thumb}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className={styles.info}>
            <p className={styles.category}>{product.category}</p>
            <h1 className={styles.title}>{product.title}</h1>
            {product.brand && (
              <p className={styles.brand}>برند: {product.brand}</p>
            )}
            <p className={styles.description}>{product.description}</p>

            {/* Pricing */}
            <div className={styles.priceRow}>
              <span className={styles.finalPrice}>
                ${discountedPrice.toFixed(2)}
              </span>
              {product.discountPercentage > 0 && (
                <>
                  <span className={styles.originalPrice}>
                    ${product.price.toFixed(2)}
                  </span>
                  <span className={styles.discount}>
                    {product.discountPercentage.toFixed(0)}% تخفیف
                  </span>
                </>
              )}
            </div>

            {/* Stats */}
            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statLabel}>امتیاز</span>
                <span className={styles.statValue}>
                  ★ {product.rating.toFixed(1)}
                </span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statLabel}>موجودی</span>
                <span
                  className={`${styles.statValue} ${product.stock < 10 ? styles.lowStock : ""}`}
                >
                  {product.stock} عدد
                </span>
              </div>
            </div>
            <button
              onClick={() => product && addToCart(product)}
              className={styles.addToCartBtn}
            >
              {isInCart ? "افزودن دوباره به سبد" : "افزودن به سبد"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
