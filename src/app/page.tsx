import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <h1 className={styles.title}>Frontend API Learning</h1>
        <p className={styles.subtitle}>مفاهیم کار با API را در عمل یاد بگیر</p>

        <div className={styles.concepts}>
          <span>GET Requests</span>
          <span>Pagination</span>
          <span>Search & Filter</span>
          <span>Loading States</span>
          <span>Error Handling</span>
          <span>AbortController</span>
          <span>Custom Hooks</span>
          <span>TypeScript Types</span>
        </div>

        <Link href="/products" className={styles.cta}>
          مشاهده محصولات →
        </Link>
      </div>
    </main>
  );
}
