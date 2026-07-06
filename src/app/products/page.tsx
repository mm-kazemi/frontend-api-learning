"use client";

import { useState } from "react";
import Link from "next/link";
import { useProducts } from "@/hooks/useProducts";
import styles from "./products.module.css";
import { useCategories } from "@/hooks/useCategories";

const LIMIT = 15;

export default function ProductsPage() {
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  const { categories } = useCategories();

  const { products, total, loading, error } = useProducts(
    query,
    page,
    LIMIT,
    category,
    sortBy,
    priceRange
  );

  const totalPages = Math.ceil(total / LIMIT);

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setQuery(searchInput.trim());
    setPage(1);
  }

  function handleClear() {
    setSearchInput("");
    setQuery("");
    setPage(1);
    setCategory("");
    setSortBy("");
    setPriceRange([0, 1000]);
  }

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <Link href="/" className={styles.backLink}>
            ← خانه
          </Link>
          <h1 className={styles.pageTitle}>محصولات</h1>
        </div>

        <form onSubmit={handleSearch} className={styles.searchForm}>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="جستجو در محصولات..."
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchBtn}>
            جستجو
          </button>
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className={styles.clearBtn}
              aria-label="پاک کردن جستجو"
            >
              ×
            </button>
          )}
        </form>

        {query && !loading && (
          <p className={styles.searchMeta}>
            {total} نتیجه برای «{query}»
          </p>
        )}

        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
          className={styles.filterSelect}
        >
          <option value="">همه دسته‌بندی‌ها</option>
          {categories.map((cat) => (
            <option key={cat.slug} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
            setPage(1);
          }}
          className={styles.filterSelect}
        >
          <option value="">مرتب سازی</option>
          <option value="price">قیمت (کم به زیاد)</option>
          <option value="rating">بهترین امتیاز</option>
        </select>

        <input
          type="range"
          min={0}
          max={1000}
          value={priceRange[1]}
          onChange={(e) => {
            setPriceRange([0, Number(e.target.value)]);
            setPage(1);
          }}
          className={styles.filterRange}
        />
        <span>تا ${priceRange[1]}</span>
      </header>

      <main className={styles.main}>
        {loading && (
          <div className={styles.stateBox}>
            <div className={styles.spinner} />
            <p>در حال بارگذاری...</p>
          </div>
        )}

        {!loading && error && (
          <div className={styles.errorBox}>
            <p className={styles.errorTitle}>خطا در دریافت داده</p>
            <p className={styles.errorMsg}>{error}</p>
            <button onClick={handleClear} className={styles.searchBtn}>
              تلاش مجدد
            </button>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className={styles.stateBox}>
            <p className={styles.emptyIcon}>🔍</p>
            <p className={styles.emptyTitle}>محصولی یافت نشد</p>
            {query && (
              <button onClick={handleClear} className={styles.searchBtn}>
                پاک کردن جستجو
              </button>
            )}
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className={styles.grid}>
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className={styles.card}
              >
                <div className={styles.imageWrap}>
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className={styles.cardImage}
                  />
                </div>
                <div className={styles.cardBody}>
                  <p className={styles.cardCategory}>{product.category}</p>
                  <h2 className={styles.cardTitle}>{product.title}</h2>
                  <div className={styles.cardFooter}>
                    <span className={styles.price}>
                      ${product.price.toFixed(2)}
                    </span>
                    <span className={styles.rating}>
                      ★ {product.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {!loading && !error && totalPages > 1 && (
        <footer className={styles.pagination}>
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
            className={styles.pageBtn}
          >
            ← قبلی
          </button>
          <span className={styles.pageInfo}>
            صفحه {page} از {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page === totalPages}
            className={styles.pageBtn}
          >
            بعدی →
          </button>
        </footer>
      )}
    </div>
  );
}
